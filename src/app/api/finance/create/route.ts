/* eslint-disable @typescript-eslint/no-explicit-any */
import { saveToGoogleSheets } from "@/lib/google/saveToGoogleSheets";
import { FinanceSchema } from "@/lib/zod/schema";
import { NextRequest, NextResponse } from "next/server";
import { Finance } from "../_models/finances";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = FinanceSchema.parse(body);

    let myAmount = data.amount;
    let homeOrOtherAmount = 0;

    if (data.splitOption === 'others' && data.extras) {
      const totalOthers = data.extras.reduce((sum, item) => sum + item.amount, 0);
      myAmount = data.amount - totalOthers;
      homeOrOtherAmount = totalOthers;
    }

    if (data.splitOption === 'home' && data.extras) {
      const totalHome = data.extras.reduce((sum, item) => sum + item.amount, 0);
      homeOrOtherAmount = totalHome;
    }

    const financeEntry = {
      id: crypto.randomUUID(),
      ...data,
      myAmount,
      homeOrOtherAmount,
      createdAt: new Date().toISOString(),
    } as Finance;

    await saveToGoogleSheets(financeEntry);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
