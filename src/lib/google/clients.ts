import { google } from "googleapis";
import { auth } from "./auth";

export function getGoogleSheetsClient() {
  return google.sheets({ version: 'v4', auth });
}
