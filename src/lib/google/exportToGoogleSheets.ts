import { google } from 'googleapis';
import { Finance } from '@/app/api/finance/_models/finances';

export async function exportToGoogleSheets(data: Finance[]) {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      project_id: process.env.GOOGLE_PROJECT_ID,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID!;
  const range = 'Finances!A1'; // aba 'Finances', a partir da célula A1

  const values = data.map((item) => [
    item.id,
    item.currency,
    item.amount,
    item.week,
    item.category,
    item.establishment,
    item.splitOption,
    item.myAmount,
    item.homeOrOtherAmount,
    item.created_at,
    JSON.stringify(item.extras || []),
  ]);

  // Adiciona cabeçalho se necessário
  const headers = [
    'ID',
    'Currency',
    'Amount',
    'Week',
    'Category',
    'Establishment',
    'Split Option',
    'My Amount',
    'Other/Home Amount',
    'Created At',
    'Extras (JSON)',
  ];

  const finalValues = [headers, ...values];

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: 'RAW',
    requestBody: {
      values: finalValues,
    },
  });
}
