/**
 * Приём ответов с сайта-приглашения → Google-таблица.
 *
 * Как работает:
 *   сайт  →  этот скрипт (веб-приложение)  →  Google-таблица «Ответы на юбилей — 50 лет»
 *
 * Таблица создаётся автоматически при первом ответе.
 * Ничего настраивать внутри таблицы не нужно.
 */

const SHEET_NAME = 'Ответы';
const TZ = 'Asia/Vladivostok';

const HEADERS = [
  'Время',
  'Ваше имя',
  'Телефон',
  'Количество гостей',
  'Вы придёте?',
  'Напитки',
  'Пожелания'
];

/** Находит или создаёт таблицу и лист с заголовками. */
function getSheet_() {
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty('SHEET_ID');

  if (id) {
    try {
      return prepareSheet_(SpreadsheetApp.openById(id));
    } catch (err) {
      // файл удалён или нет доступа — создадим новый ниже
    }
  }

  const ss = SpreadsheetApp.create('Ответы на юбилей — 50 лет');
  props.setProperty('SHEET_ID', ss.getId());
  return prepareSheet_(ss);
}

/** Приводит лист в нужный вид: имя, заголовки, оформление. */
function prepareSheet_(ss) {
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.getSheets()[0];
    sheet.setName(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);

    const head = sheet.getRange(1, 1, 1, HEADERS.length);
    head.setFontWeight('bold');
    head.setBackground('#3d2b20');
    head.setFontColor('#f7f1e7');
    head.setHorizontalAlignment('center');

    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 140);
    sheet.setColumnWidth(2, 180);
    sheet.setColumnWidth(3, 160);
    sheet.setColumnWidth(4, 150);
    sheet.setColumnWidth(5, 200);
    sheet.setColumnWidth(6, 320);
    sheet.setColumnWidth(7, 400);
  }

  return sheet;
}

/** Приём ответа с сайта (POST). */
function doPost(e) {
  const lock = LockService.getScriptLock();

  try {
    lock.waitLock(20000);

    const p = (e && e.parameter) || {};
    const sheet = getSheet_();

    sheet.appendRow([
      Utilities.formatDate(new Date(), TZ, 'dd.MM.yyyy HH:mm'),
      String(p.name || '').trim(),
      String(p.phone || '').trim(),
      String(p.guests || '').trim(),
      String(p.attendance || '').trim(),
      String(p.drinks || '').trim(),
      String(p.message || '').trim()
    ]);

    return ContentService.createTextOutput('OK');
  } catch (err) {
    return ContentService.createTextOutput('ERROR: ' + err.message);
  } finally {
    try { lock.releaseLock(); } catch (ignore) {}
  }
}

/**
 * Проверка в браузере: открыть ссылку /exec — увидите «OK».
 * /exec?info=1 — покажет, где лежит таблица.
 */
function doGet(e) {
  const params = (e && e.parameter) || {};

  if (params.info) {
    try {
      const sheet = getSheet_();
      const ss = sheet.getParent();
      return ContentService.createTextOutput(JSON.stringify({
        sheet: ss.getName(),
        url: ss.getUrl(),
        rows: Math.max(0, sheet.getLastRow() - 1)
      })).setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
      return ContentService.createTextOutput('ERROR: ' + err.message);
    }
  }

  return ContentService.createTextOutput('OK');
}
