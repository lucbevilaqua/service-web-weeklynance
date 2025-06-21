import { google } from 'googleapis';
import { auth } from './auth';

export default async function deleteRowGoogleSheets(rowNumber: number) {
  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID!;
  const sheetName = process.env.GOOGLE_SHEET_NAME!;

  // Passo 1: Buscar sheetId correto pelo nome da aba
  const spreadsheetMeta = await sheets.spreadsheets.get({
    spreadsheetId,
  });

  const sheet = spreadsheetMeta.data.sheets?.find(
    (s) => s.properties?.title === sheetName
  );

  if (!sheet || sheet.properties?.sheetId === undefined) {
    throw new Error(`Sheet '${sheetName}' not found`);
  }

  const sheetId = sheet.properties.sheetId;

  // Passo 2: Validar que temos pelo menos 2 linhas (header + dados)
  const readRes = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: sheetName,
  });

  const rows = readRes.data.values;
  if (!rows || rows.length < 2) {
    return { body: { error: 'No data found' }, code: 404 };
  }

  // Passo 3: Deletar a linha pelo sheetId correto
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId, // ID correto da aba
              dimension: 'ROWS',
              startIndex: rowNumber,
              endIndex: rowNumber + 1,
            },
          },
        },
      ],
    },
  });

  return { body: { success: true }, code: 200 };
}
