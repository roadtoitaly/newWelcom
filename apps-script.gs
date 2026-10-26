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
    const analyticsRow = analytics.getLastRow() + 1;
    analytics.getRange(analyticsRow, 1, 1, 17).setValues([[
      new Date(), d.event || '', d.sessionId || '', d.page || '',
      Number(d.durationSeconds) || 0, d.form || '', d.device || '',
      d.source || 'direct', d.medium || '', d.campaign || '',
      d.content || '', d.referrer || 'direct', d.landingPage || '',
      d.language || '', d.timezone || '', d.screen || '', d.browser || ''
    ]]);
    formatTimestamp_(analytics, analyticsRow);
    return json_({ ok: true });
  }
  const isBot = String(d.type || '').toLowerCase() === 'bot'
    || /bot|whatsapp/i.test(String(d.source || ''))
    || !d.source;
  const sheet = getDataSheet_(isBot ? 'Bot_Data' : 'Road_to_Italy');
  const row = sheet.getLastRow() + 1;
  sheet.getRange(row, 1, 1, 9).setValues([[
    new Date(), d.source || '', d.name || '', d.email || '', d.phone || '',
    d.gpa || '', d.major || '', d.interest || '', d.page || ''
  ]]);
  formatTimestamp_(sheet, row);
  setContactStatus_(sheet, row);
  return json_({ ok: true, sheet: sheet.getName() });
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
  const mediums = {};
  const campaigns = {};
  const landingPages = {};
  const devices = {};
  const languages = {};
  const timezones = {};
  const forms = {};
  let totalDuration = 0;
  let durationCount = 0;

  rows.forEach(row => {
    const date = Utilities.formatDate(row[0], Session.getScriptTimeZone(), 'yyyy-MM-dd');
    const event = String(row[1] || '');
    const sessionId = String(row[2] || '');
    const page = String(row[3] || '/') || '/';
    const source = String(row[7] || 'direct');
    const medium = String(row[8] || 'unknown');
    const campaign = String(row[9] || 'none');
    const landingPage = String(row[12] || page);
    const device = String(row[6] || 'unknown');
    const language = String(row[13] || 'unknown');
    const timezone = String(row[14] || 'unknown');
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
      mediums[medium] = (mediums[medium] || 0) + 1;
      campaigns[campaign] = (campaigns[campaign] || 0) + 1;
      landingPages[landingPage] = (landingPages[landingPage] || 0) + 1;
      devices[device] = (devices[device] || 0) + 1;
      languages[language] = (languages[language] || 0) + 1;
      timezones[timezone] = (timezones[timezone] || 0) + 1;
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
    mediums: mediums,
    campaigns: campaigns,
    landingPages: landingPages,
    devices: devices,
    languages: languages,
    timezones: timezones,
    forms: forms,
    updatedAt: new Date().toISOString()
  });
}

function getAnalyticsSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName('Analytics');
  const headers = ['Timestamp', 'Event', 'Session ID', 'Page', 'Duration Seconds', 'Form', 'Device', 'Source', 'Medium', 'Campaign', 'Content', 'Referrer', 'Landing Page', 'Language', 'Timezone', 'Screen', 'Browser'];
  if (!sheet) {
    sheet = spreadsheet.insertSheet('Analytics');
    sheet.setFrozenRows(1);
  }
  if (sheet.getLastColumn() < headers.length) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
  sheet.getRange('A:A').setNumberFormat('yyyy-mm-dd hh:mm:ss');
  return sheet;
}

function getDataSheet_(name) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(name);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(name);
  }
  sheet.getRange('A:A').setNumberFormat('yyyy-mm-dd hh:mm:ss');
  return sheet;
}

function setContactStatus_(sheet, row) {
  const lastColumn = Math.max(sheet.getLastColumn(), 9);
  const headers = sheet.getRange(1, 1, 1, lastColumn).getValues()[0].map(value => String(value).trim().toLowerCase());
  let statusColumn = headers.findIndex(header => header === 'حالة التواصل' || header === 'contact status') + 1;
  if (!statusColumn) {
    statusColumn = lastColumn + 1;
    sheet.getRange(1, statusColumn).setValue('حالة التواصل');
  }
  if (!sheet.getRange(row, statusColumn).getValue()) {
    sheet.getRange(row, statusColumn).setValue('لم يتم التواصل');
  }
}

function formatTimestamp_(sheet, row) {
  sheet.getRange(row, 1).setNumberFormat('yyyy-mm-dd hh:mm:ss');
}

function json_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
