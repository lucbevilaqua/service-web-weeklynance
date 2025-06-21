/* eslint-disable @typescript-eslint/no-explicit-any */
import deleteRowGoogleSheets from "@/lib/google/deleteRowGoogleSheets";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rowNumberToDelete = searchParams.get('rowNumber');

    if (!rowNumberToDelete) {
      return NextResponse.json({ error: 'Missing rowNumber' }, { status: 400 });
    }

    const response = await deleteRowGoogleSheets(+rowNumberToDelete);

    return NextResponse.json({ ...response.body }, { status: response.code });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
