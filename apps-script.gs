/**
 * ROAD to ITALY — Google Sheets receiver
 * Deploy as Web App: Execute as Me; Who has access: Anyone.
 * Existing mixed/legacy lead tabs are preserved. If their headers do not
 * match the fixed schema, new clean tabs (Bot_Data_v2 / Road_to_Italy_v2)
 * are used automatically, so old student data is not overwritten.
 */

const LEAD_HEADERS = [
  'Timestamp', 'Source', 'Name', 'Email', 'Phone', 'GPA', 'Major',
  'Interest', 'Page', 'Age', 'Governorate', 'Faculty', 'Language Cert',
  'Study Language', 'Goal', 'Academic Year', 'Target Field', 'Chosen Major',
  'Current Situation', 'Inquiries', 'Raw Payload', 'Contact Status'
];

const ANALYTICS_HEADERS = [
  'Timestamp', 'Event', 'Session ID', 'Page', 'Duration Seconds', 'Form',
  'Device', 'Source', 'Medium', 'Campaign', 'Content', 'Referrer',
  'Landing Page', 'Language', 'Timezone', 'Screen', 'Browser'
];

function doPost(e) {
  try {
    const raw = e && e.postData && e.postData.contents ? e.postData.contents : '{}';
    const d = JSON.parse(raw);

    if (d.type === 'analytics') {
      const sheet = getAnalyticsSheet_();
      const row = sheet.getLastRow() + 1;
      sheet.getRange(row, 1, 1, ANALYTICS_HEADERS.length).setValues([[
        new Date(), d.event || '', d.sessionId || '', d.page || '/',
        Number(d.durationSeconds) || 0, d.form || '', d.device || '',
        d.source || 'direct', d.medium || '', d.campaign || '', d.content || '',
        d.referrer || 'direct', d.landingPage || '', d.language || '',
        d.timezone || '', d.screen || '', d.browser || ''
      ]]);
      formatTimestamp_(sheet, row);
      return json_({ ok: true, type: 'analytics', sheet: sheet.getName(), row: row });
    }

    const isBot = String(d.type || '').toLowerCase() === 'bot' ||
      /bot|whatsapp/i.test(String(d.source || ''));
    const preferredName = isBot ? 'Bot_Data' : 'Road_to_Italy';
    const sheet = getLeadSheet_(preferredName);
    const savedRow = appendLeadRow_(sheet, d, isBot);

    return json_({
      ok: true,
      type: isBot ? 'bot' : 'website',
      sheet: sheet.getName(),
      row: savedRow
    });
  } catch (error) {
    console.error('doPost error:', error && error.stack ? error.stack : error);
    return json_({ ok: false, error: String(error && error.message ? error.message : error) });
  }
}

function doGet(e) {
  const params = e && e.parameter ? e.parameter : {};
  const days = Math.min(Math.max(Number(params.days) || 7, 1), 90);
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const sheet = getAnalyticsSheet_();
  const values = sheet.getDataRange().getValues();
  const rows = values.slice(1).filter(row => row[0] instanceof Date && row[0] >= since);

  const sessions = {}, daily = {}, pages = {}, sources = {}, mediums = {};
  const campaigns = {}, landingPages = {}, devices = {}, languages = {};
  const timezones = {}, forms = {};
  let totalDuration = 0, durationCount = 0;

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
    daily, pages, sources, mediums, campaigns, landingPages, devices,
    languages, timezones, forms,
    updatedAt: new Date().toISOString()
  });
}

function getAnalyticsSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Analytics');
  if (!sheet) sheet = ss.insertSheet('Analytics');
  ensureExactHeaders_(sheet, ANALYTICS_HEADERS);
  sheet.getRange('A:A').setNumberFormat('yyyy-mm-dd hh:mm:ss');
  return sheet;
}

function getLeadSheet_(preferredName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(preferredName);
  if (!sheet) {
    sheet = ss.insertSheet(preferredName);
    ensureExactHeaders_(sheet, LEAD_HEADERS);
    return sheet;
  }

  if (hasExactHeaders_(sheet, LEAD_HEADERS)) return sheet;

  // Preserve the old mixed-schema sheet. Write new leads to a clean v2 tab.
  const cleanName = preferredName + '_v2';
  let clean = ss.getSheetByName(cleanName);
  if (!clean) clean = ss.insertSheet(cleanName);
  ensureExactHeaders_(clean, LEAD_HEADERS);
  return clean;
}

function appendLeadRow_(sheet, d, isBot) {
  const pick = (...keys) => {
    for (const key of keys) {
      const value = d[key];
      if (value !== undefined && value !== null && String(value).trim() !== '') return value;
    }
    return '';
  };

  const rowValues = [
    new Date(),
    pick('source') || (isBot ? 'WhatsApp Bot' : 'website'),
    pick('name'), pick('email'), pick('phone'), pick('gpa'),
    pick('major', 'chosen_major', 'target_field'),
    pick('interest', 'goal'),
    pick('page') || (isBot ? 'whatsapp-bot' : 'website'),
    pick('age'), pick('governorate'), pick('faculty'), pick('language_cert'),
    pick('study_language'), pick('goal'), pick('academic_year'),
    pick('target_field'), pick('chosen_major'), pick('current_situation'),
    pick('inquiries'), JSON.stringify(d.rawPayload || d), 'لم يتم التواصل'
  ];

  if (rowValues.length !== LEAD_HEADERS.length) {
    throw new Error('Lead data does not match the expected ' + LEAD_HEADERS.length + '-column schema.');
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    // Recheck after acquiring lock in case another request initialized the tab.
    ensureExactHeaders_(sheet, LEAD_HEADERS);
    const row = sheet.getLastRow() + 1;
    sheet.getRange(row, 1, 1, LEAD_HEADERS.length).setValues([rowValues]);
    formatTimestamp_(sheet, row);
    SpreadsheetApp.flush();
    return row;
  } finally {
    lock.releaseLock();
  }
}

function hasExactHeaders_(sheet, expected) {
  if (sheet.getLastRow() < 1 || sheet.getLastColumn() < expected.length) return false;
  const actual = sheet.getRange(1, 1, 1, expected.length).getDisplayValues()[0]
    .map(value => String(value).trim());
  return expected.every((header, i) => actual[i] === header);
}

function ensureExactHeaders_(sheet, expected) {
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, expected.length).setValues([expected]);
    sheet.setFrozenRows(1);
    return;
  }
  if (!hasExactHeaders_(sheet, expected)) {
    throw new Error('Header mismatch in sheet "' + sheet.getName() + '". Existing data was preserved.');
  }
}

function formatTimestamp_(sheet, row) {
  sheet.getRange(row, 1).setNumberFormat('yyyy-mm-dd hh:mm:ss');
}

function json_(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
