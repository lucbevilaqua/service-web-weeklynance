/* eslint-disable @typescript-eslint/no-explicit-any */
import { saveToGoogleSheets } from "@/lib/google/saveToGoogleSheets";
import { FinanceSchema } from "@/lib/zod/schema";
import { NextRequest, NextResponse } from "next/server";
import { Finance, Resume } from "../_models/finances";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = FinanceSchema.parse(body);

    const resume: Resume = { others: 0, myAmount: data.amount, house: 0 };
    if(data.extras?.length) {

      for (const element of data.extras) {
        const cat = element.splitOption as 'others' | 'house';
        resume[cat] += element.amount;

        resume.myAmount -= element.amount;
      }
    }

    const financeEntry = {
      id: crypto.randomUUID(),
      ...data,
      resume,
      date: data.date,
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
