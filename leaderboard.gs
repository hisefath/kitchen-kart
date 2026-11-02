// Kitchen Kart leaderboard: paste this into a Google Sheet's Extensions → Apps Script, then
// Deploy → New deployment → Web app → Execute as: Me, Who has access: Anyone. Copy the /exec URL
// into BOARD_URL at the top of index.html. Rows land in the sheet: board | name | score | time.

const sheet = () => SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

// GET ?board=bots|multi → top 10 as JSON
function doGet(e) {
  const board = e.parameter.board;
  const top = sheet().getDataRange().getValues()
    .filter(r => r[0] === board)
    .map(r => ({ name: String(r[1]), score: Number(r[2]) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
  return ContentService.createTextOutput(JSON.stringify(top)).setMimeType(ContentService.MimeType.JSON);
}

// POST {board, name, score} → append one row (validated: open endpoint, so trust nothing)
function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  const name = String(d.name || '').replace(/[^A-Za-z0-9_-]/g, '').slice(0, 12); // also blocks =formula injection
  const score = Math.round(Number(d.score));
  if ((d.board === 'bots' || d.board === 'multi') && name && score > 0 && score <= 5000) {
    sheet().appendRow([d.board, name, score, new Date()]);
  }
  return ContentService.createTextOutput('ok');
}
