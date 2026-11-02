/**
 * Where Should the Surgeon Go? Class results collector
 * Copyright (c) 2026 Eric E Castro, Psychology Department, St Ignatius College Prep.
 * Licensed under CC BY 4.0: https://creativecommons.org/licenses/by/4.0/
 *
 * Receives each student's result code from the GitHub Pages activity (index.html)
 * and saves one row per surgery to the "Responses" tab, with the date only (no time
 * of day, no name). If the page resends the same submission (for example after a
 * dropped connection), the row is updated instead of duplicated.
 * The "Summary" tab counts routes and outcomes by school year.
 *
 * Setup (once):
 *   1. In the Google Sheet, open Extensions > Apps Script, paste this file, and save.
 *   2. Run setup(), then setResultsKey(). Copy the key it shows.
 *   3. Deploy > New deployment > Web app (Execute as: Me, Who has access: Anyone).
 *   4. Paste the web app URL (ends in /exec) into `sheetUrl` in content.js.
 * After editing this script later, redeploy: Deploy > Manage deployments > Edit > New version.
 *
 * results.html asks for the key and loads the class's result codes from here.
 * It never receives names, because names are never sent.
 */

var RESPONSES = 'Responses';
var SUMMARY = 'Summary';
var YEAR_STARTS_MONTH = 8;      // school year starts in August (1 = January)
var KEY_PROP = 'RESULTS_KEY';

// Must match content.js. Unknown codes are rejected instead of stored.
var ABILITIES = ['MEM', 'SPK', 'UND', 'RDW', 'NUM', 'PLN', 'HND', 'LEG', 'VIS', 'TCH', 'INI', 'BIM'];
var ROUTES = {   // route code: number of risks on that route
  FRON: 4, PARI: 4, TEMP: 3, MIDL: 4, NONE: 5
};
var CODE_RE = /^V\d+(?:-[A-Z]{3}){6}-[A-Z]{4}-[PTS]{1,12}$/;

var HEADERS = [
  'Date', 'School year', 'Semester', 'Section', 'Result code', 'Version',
  'Priority #1', 'Priority #2', 'Priority #3', 'Priority #10', 'Priority #11', 'Priority #12 (lowest)',
  'Route', 'Outcomes (P/T/S)', 'Permanent', 'Temporary', 'Spared',
  'Attempt on this device', 'Submission ID (random)'
];
var COL = {};
HEADERS.forEach(function (h, i) { COL[h] = i + 1; });
var ID_COL = HEADERS.length;

/* ---------- One-time setup: run this once from the editor ---------- */
function setup() {
  var ss = SpreadsheetApp.getActive();

  var sh = ss.getSheetByName(RESPONSES);
  if (!sh) {
    var first = ss.getSheets()[0];
    // Reuse the empty starter tab ("Sheet1") instead of leaving it behind
    if (ss.getSheets().length === 1 && first.getLastRow() === 0) sh = first.setName(RESPONSES);
    else sh = ss.insertSheet(RESPONSES, 0);
  }
  sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  sh.setFrozenRows(1);
  sh.getRange('1:1').setFontWeight('bold').setWrap(true);
  sh.getRange('A:A').setNumberFormat('yyyy-mm-dd');
  sh.getRange('B:N').setNumberFormat('@');           // keep "2026-27" and codes as text
  sh.getRange('S:S').setNumberFormat('@');

  var su = ss.getSheetByName(SUMMARY) || ss.insertSheet(SUMMARY);
  su.clear();
  su.getRange('A1').setValue('Routes chosen by school year').setFontWeight('bold');
  su.getRange('A2').setFormula(
    '=IFERROR(QUERY(' + RESPONSES + '!A:Q,' +
    '"select B, M, count(E), avg(O), avg(P) where E is not null group by B, M order by B, M ' +
    'label B \'School year\', M \'Route\', count(E) \'Students\', avg(O) \'Avg permanent\', avg(P) \'Avg temporary\'", 1),' +
    '"No results yet")'
  );
  su.getRange('H1').setValue('Ability ranked #1, by school year').setFontWeight('bold');
  su.getRange('H2').setFormula(
    '=IFERROR(QUERY(' + RESPONSES + '!A:Q,' +
    '"select B, G, count(E) where E is not null group by B, G order by B, count(E) desc ' +
    'label B \'School year\', G \'Ranked #1\', count(E) \'Students\'", 1),' +
    '"No results yet")'
  );
  su.getRange('D:E').setNumberFormat('0.00');
  su.getRange('2:2').setFontWeight('bold');
  su.setFrozenRows(2);

  try {
    SpreadsheetApp.getUi().alert('Setup complete. Next: run setResultsKey, then Deploy > New deployment > Web app.');
  } catch (x) {}
}

/* ---------- Receive one result ---------- */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    var d = JSON.parse(e.postData.contents);

    var code = String(d.code || '').toUpperCase().trim();
    var p = parseCode(code);   // throws if malformed
    var section = String(d.section || '').replace(/[^A-Za-z0-9 \-]/g, '').slice(0, 20);
    var id = String(d.id || '');
    if (!/^[A-Za-z0-9-]{8,40}$/.test(id)) throw new Error('bad id');
    var attempt = Number(d.attempt);
    attempt = attempt === Math.floor(attempt) && attempt >= 1 && attempt <= 99 ? attempt : '';

    var today = dateOnly(new Date());   // server date, no time of day
    var count = function (ch) { return p.outcomes.split('').filter(function (o) { return o === ch; }).length; };
    var tail = [section, code, p.version].concat(p.top, p.bottom).concat([
      p.route, p.outcomes, count('P'), count('T'), count('S'), attempt, id
    ]);

    lock.waitLock(10000);
    var sh = SpreadsheetApp.getActive().getSheetByName(RESPONSES);
    if (!sh) throw new Error('run setup() first');

    var existing = sh.getLastRow() > 1
      ? sh.getRange(2, ID_COL, sh.getLastRow() - 1, 1).createTextFinder(id).matchEntireCell(true).findNext()
      : null;
    if (existing) {
      var r = existing.getRow();
      var kept = sh.getRange(r, 1, 1, 3).getValues()[0];   // keep the original date, year, semester
      sh.getRange(r, 1, 1, HEADERS.length).setValues([kept.concat(tail)]);
    } else {
      sh.appendRow([today, schoolYear(today), semester(today)].concat(tail));
    }
    CacheService.getScriptCache().remove('results');
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err.message || err) });
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}

/* ---------- Send the class's codes to results.html ---------- */
function doGet(e) {
  var params = (e && e.parameter) || {};
  if (params.view !== 'results') return json({ ok: true, message: 'Brain surgery simulation collector is running.' });

  var stored = PropertiesService.getScriptProperties().getProperty(KEY_PROP);
  if (!stored) return json({ ok: false, error: 'no-key', message: 'Run setResultsKey() in the Apps Script editor first.' });
  if (!safeEqual(String(params.key || ''), stored)) {
    Utilities.sleep(800);   // slow down guessing
    return json({ ok: false, error: 'bad-key', message: 'That key is not right.' });
  }

  var cache = CacheService.getScriptCache();
  var cached = cache.get('results');
  if (cached) return ContentService.createTextOutput(cached).setMimeType(ContentService.MimeType.JSON);

  var sh = SpreadsheetApp.getActive().getSheetByName(RESPONSES);
  var last = sh ? sh.getLastRow() : 0;
  var rows = last > 1 ? sh.getRange(2, 1, last - 1, HEADERS.length).getValues() : [];
  var tz = Session.getScriptTimeZone();
  var out = {
    ok: true,
    rows: rows
      .filter(function (r) { return r[COL['Result code'] - 1]; })
      .map(function (r) {
        var dt = r[0] instanceof Date && !isNaN(r[0]) ? r[0] : null;
        return {
          date: dt ? Utilities.formatDate(dt, tz, 'yyyy-MM-dd') : '',
          year: String(r[1] || (dt ? schoolYear(dt) : '')),
          semester: String(r[2] || (dt ? semester(dt) : '')),
          section: String(r[3] || ''),
          code: String(r[COL['Result code'] - 1]),
          attempt: Number(r[COL['Attempt on this device'] - 1]) || null
        };
      })
  };
  var text = JSON.stringify(out);
  if (text.length < 90000) cache.put('results', text, 30);
  return ContentService.createTextOutput(text).setMimeType(ContentService.MimeType.JSON);
}

// Run once from the editor. Creates (or replaces) the key results.html asks for.
// Running it again makes a new key and the old one stops working.
function setResultsKey() {
  var key = (Utilities.getUuid() + Utilities.getUuid()).replace(/-/g, '').slice(0, 32);
  PropertiesService.getScriptProperties().setProperty(KEY_PROP, key);
  CacheService.getScriptCache().remove('results');
  var msg = 'Your results key:\n\n' + key + '\n\nCopy it now and paste it into results.html when it asks. ' +
    'Anyone with this key can load the class result codes (never names). Run setResultsKey again to replace it.';
  Logger.log(msg);
  try { SpreadsheetApp.getUi().alert(msg); } catch (x) { /* run from the API: the log has it */ }
}

/* ---------- Helpers ---------- */
function parseCode(code) {
  if (!CODE_RE.test(code)) throw new Error('bad code');
  var parts = code.split('-');
  var six = parts.slice(1, 7);
  six.forEach(function (a) { if (ABILITIES.indexOf(a) < 0) throw new Error('bad ability'); });
  if (six.filter(function (a, i) { return six.indexOf(a) === i; }).length !== 6) throw new Error('repeated ability');
  var route = parts[7], outcomes = parts[8];
  if (!(route in ROUTES) || ROUTES[route] !== outcomes.length) throw new Error('bad route');
  return { version: parts[0], top: six.slice(0, 3), bottom: six.slice(3), route: route, outcomes: outcomes };
}

function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  var diff = 0;
  for (var i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function schoolYear(date) {
  var tz = Session.getScriptTimeZone();
  var y = Number(Utilities.formatDate(date, tz, 'yyyy'));
  var m = Number(Utilities.formatDate(date, tz, 'M'));
  var start = m >= YEAR_STARTS_MONTH ? y : y - 1;
  return start + '-' + String(start + 1).slice(2);
}

// Fall = YEAR_STARTS_MONTH to December; Spring = January to the month before.
function semester(date) {
  var tz = Session.getScriptTimeZone();
  var y = Number(Utilities.formatDate(date, tz, 'yyyy'));
  var m = Number(Utilities.formatDate(date, tz, 'M'));
  return (m >= YEAR_STARTS_MONTH ? 'Fall ' : 'Spring ') + y;
}

function dateOnly(date) {
  var tz = Session.getScriptTimeZone();
  return Utilities.parseDate(Utilities.formatDate(date, tz, 'yyyy-MM-dd'), tz, 'yyyy-MM-dd');
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
