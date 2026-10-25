/**
 * Road to Italy — Google Sheet receiver
 * 1) Create a Google Sheet. Add these headers in row 1:
 *    Timestamp | Source | Name | Email | Phone | GPA | Major | Interest | Page
 *    The script creates an "Analytics" sheet automatically for tracking events.
 * 2) In the sheet: Extensions > Apps Script. Paste this file, save.
 * 3) Deploy > New deployment > type "Web app"
 *      Execute as: Me      Who has access: Anyone
 * 4) Copy the Web app URL and paste it into SHEET_WEB_APP_URL in site.js
 */
function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  if (d.type === 'analytics') {
    const analytics = getAnalyticsSheet_();
    analytics.appendRow([
      new Date(), d.event || '', d.sessionId || '', d.page || '',
      Number(d.durationSeconds) || 0, d.form || '', d.device || '',
      d.source || 'direct'
    ]);
    return json_({ ok: true });
  }
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  sheet.appendRow([
    new Date(), d.source || '', d.name || '', d.email || '', d.phone || '',
    d.gpa || '', d.major || '', d.interest || '', d.page || ''
  ]);
  return json_({ ok: true });
}

function doGet(e) {
  const days = Math.min(Math.max(Number(e.parameter.days) || 7, 1), 90);
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const sheet = getAnalyticsSheet_();
  const values = sheet.getDataRange().getValues();
  const rows = values.slice(1).filter(row => row[0] instanceof Date && row[0] >= since);
  const sessions = {};
  const daily = {};
  const pages = {};
  const sources = {};
  const forms = {};
  let totalDuration = 0;
  let durationCount = 0;

  rows.forEach(row => {
    const date = Utilities.formatDate(row[0], Session.getScriptTimeZone(), 'yyyy-MM-dd');
    const event = String(row[1] || '');
    const sessionId = String(row[2] || '');
    const page = String(row[3] || '/') || '/';
    const source = String(row[7] || 'direct');
    daily[date] = (daily[date] || 0) + 1;
    if (sessionId) sessions[sessionId] = true;
    if (event === 'page_view') pages[page] = (pages[page] || 0) + 1;
    if (event === 'session_end' && Number(row[4]) > 0) {
      totalDuration += Number(row[4]);
      durationCount++;
    }
    if (event === 'form_open' || event === 'form_view') {
      const form = String(row[5] || 'Unknown form');
      if (!forms[form]) forms[form] = { opens: 0, submissions: 0 };
      forms[form].opens++;
    }
    if (event === 'form_submit') {
      const form = String(row[5] || 'Unknown form');
      if (!forms[form]) forms[form] = { opens: 0, submissions: 0 };
      forms[form].submissions++;
    }
    if (event === 'page_view') {
      const label = source === 'direct' ? 'Direct' : source;
      sources[label] = (sources[label] || 0) + 1;
    }
  });

  return json_({
    ok: true,
    periodDays: days,
    visitors: Object.keys(sessions).length,
    pageViews: rows.filter(row => row[1] === 'page_view').length,
    averageDurationSeconds: durationCount ? Math.round(totalDuration / durationCount) : 0,
    formOpens: rows.filter(row => row[1] === 'form_open' || row[1] === 'form_view').length,
    formSubmissions: rows.filter(row => row[1] === 'form_submit').length,
    daily: daily,
    pages: pages,
    sources: sources,
    forms: forms,
    updatedAt: new Date().toISOString()
  });
}

function getAnalyticsSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName('Analytics');
  if (!sheet) {
    sheet = spreadsheet.insertSheet('Analytics');
    sheet.appendRow(['Timestamp', 'Event', 'Session ID', 'Page', 'Duration Seconds', 'Form', 'Device', 'Source']);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function json_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
