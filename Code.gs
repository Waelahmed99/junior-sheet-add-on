const sheets = ['A','B','C1','C2','D1','D2','D3']

const onInstall = (e) => onOpen(e)

const onOpen = (e) => createMenu()

function createMenu() {
  const ui = SpreadsheetApp.getUi()
  
  const submenu = ui.createMenu('Specific sheet')

  for (var sheet in sheets) {
    const name = sheets[sheet]
    submenu.addItem(name, name)
  }

  ui.createMenu('Sheet Automation')
    .addItem('Start script', 'startScript')
    .addSubMenu(submenu)
    .addSeparator()
    .addItem('First time?', 'guide')
    .addToUi();
}

function guide() {
  const cfHandle = promptForHandle('Codeforces', 'CF')
  const uvaHandle = promptForHandle('UVA', 'UVA')

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Info')
  const lastRow = sheet.getLastRow()
  sheet.insertRowAfter(lastRow)

  sheet.getRange(lastRow + 1, 1, 1, 2).setValues([[cfHandle, uvaHandle]])
}

function promptForHandle(name, abbr) {
  const ui = SpreadsheetApp.getUi()
  const result = ui.prompt(
      `Enter your ${name} handle!`,
      `Click Cancel if you don't want ${abbr} submissions`,
      ui.ButtonSet.OK_CANCEL);

  const button = result.getSelectedButton()
  if (button != ui.Button.OK) { // User clicked "OK"
    return ''
  }

  return result.getResponseText()
}

function handleError(handle, which) {
  Browser.msgBox(`Oops, you have just entered wrong handle! \\n${which}:${handle}`)
}
