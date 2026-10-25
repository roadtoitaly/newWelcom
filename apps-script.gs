/**
 * Road to Italy — Google Sheet receiver
 * 1) Create a Google Sheet. Add these headers in row 1:
 *    Timestamp | Source | Name | Email | Phone | GPA | Major | Interest | Page
 * 2) In the sheet: Extensions > Apps Script. Paste this file, save.
 * 3) Deploy > New deployment > type "Web app"
 *      Execute as: Me      Who has access: Anyone
 * 4) Copy the Web app URL and paste it into SHEET_WEB_APP_URL in site.js
 */
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  const d = JSON.parse(e.postData.contents);
  sheet.appendRow([
    new Date(), d.source || '', d.name || '', d.email || '', d.phone || '',
    d.gpa || '', d.major || '', d.interest || '', d.page || ''
  ]);
  return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
}
