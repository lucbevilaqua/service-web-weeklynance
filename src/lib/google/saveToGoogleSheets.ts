import { google } from 'googleapis';
import { Finance } from '@/app/api/finance/_models/finances';
import { auth } from './auth';

export async function saveToGoogleSheets(entry: Finance) {
  const sheets = google.sheets({ version: 'v4', auth });

  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID!;
  const range = 'Database!A2:K'; // Começa após o header

  const row = [
    entry.id,
    entry.currency,
    entry.amount.toString(),
    entry.week,
    entry.category,
    entry.establishment,
    entry.splitOption,
    entry.myAmount.toString(),
    entry.homeOrOtherAmount.toString(),
    entry.createdAt,
    JSON.stringify(entry.extras || []),
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: 'RAW',
    requestBody: {
      values: [row],
    },
  });
}
