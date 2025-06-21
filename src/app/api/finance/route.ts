/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import db from "@/lib/db";
import { Finance, FinanceDb } from "./_models/finances";

const FinanceSchema = z.object({
  currency: z.string(),
  amount: z.number(),
  week: z.string(),
  category: z.string(),
  establishment: z.string(),
  splitOption: z.enum(["mine", "others", "home"]),
  extras: z
    .array(z.object({ name: z.string(), value: z.number() }))
    .optional()
});

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing id" },
        { status: 400 }
      );
    }

    const deleteStmt = db.prepare(`
      DELETE FROM finances
      WHERE id = ?
    `);

    const result = deleteStmt.run(Number(id));

    if (result.changes === 0) {
      return NextResponse.json(
        { success: false, error: "No record found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    let query = "SELECT * FROM finances";
    const params = [];
    
    // Apply date filter if provided
    if (startDate || endDate) {
      query += " WHERE";
      if (startDate) {
        query += " created_at >= ?";
        params.push(startDate);
      }
      if (endDate) {
        if (startDate) query += " AND";
        query += " created_at <= ?";
        params.push(endDate);
      }
    }

    const stmt = db.prepare(query);
    const rows = stmt.all(...params) as FinanceDb[];

    // Parse extras JSON for each row
    const data: Array<Finance> = rows.map(row => ({
      ...row,
      extras: row.extras ? JSON.parse(row.extras) : null
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = FinanceSchema.parse(body);

    let myAmount = data.amount;
    let homeOrOtherAmount = 0;

    if (data.splitOption === "others" && data.extras) {
      const totalOthers = data.extras.reduce((sum, item) => sum + item.value, 0);
      myAmount = data.amount - totalOthers;
      homeOrOtherAmount = totalOthers;
    }

    if (data.splitOption === "home" && data.extras) {
      const totalHome = data.extras.reduce((sum, item) => sum + item.value, 0);
      homeOrOtherAmount = totalHome;
    }

    // Insert into SQLite database
    const insert = db.prepare(`
      INSERT INTO finances (currency, amount, week, category, establishment, split_option, extras, my_amount, home_or_other_amount)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insert.run(
      data.currency,
      data.amount,
      data.week,
      data.category,
      data.establishment,
      data.splitOption,
      data.extras ? JSON.stringify(data.extras) : null,
      myAmount,
      homeOrOtherAmount
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 400 }
    );
  }
}

