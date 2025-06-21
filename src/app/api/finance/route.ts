/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { FinanceSheets } from "./_models/finances";
import getGoogleSheets from "@/lib/google/getGoogleSheets";

export async function GET() {
  try {
    
    const response = await getGoogleSheets();

    const rows = response.data.values;

    if (!rows || rows.length <= 1) {
      return NextResponse.json({ data: [] }); // Nenhum dado além do cabeçalho
    }

    // Remove a primeira linha (header)
    const data = rows.slice(1);

    const dataMapped: FinanceSheets[] = data.map((raw, i) => ({
      rowNumber: i,
      id: raw[0],
      currency: raw[1],
      amount: +raw[2],
      week: raw[3],
      category: raw[4],
      establishment: raw[5],
      splitOption: raw[6],
      myAmount: +raw[7],
      homeOrOtherAmount: +raw[8],
      createdAt: raw[9],
      extras: JSON.parse(raw[10]),
    }));

    return NextResponse.json({ data: dataMapped });
  } catch (error: any) {
    console.error('Error fetching spreadsheet data:', error.message);
    return NextResponse.json(
      { error: 'Failed to fetch spreadsheet data' },
      { status: 500 }
    );
  }
}
