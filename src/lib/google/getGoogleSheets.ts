import { google } from "googleapis";
import { auth } from "./auth";

export default async function getGoogleSheets() {
  const sheets = google.sheets({ version: 'v4', auth });

  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID!;
  const sheetName = process.env.GOOGLE_SHEET_NAME!;

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}`,
  });

  return response;
}
