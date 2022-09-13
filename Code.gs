/*
  Create `Sheet Automation` menu 
     After opening the sheet.
*/
const onOpen = (e) => createMenu('')

/*
  if used as an external library, [libName] is required. 
  @param libName: The name of library in your code to fire function on menu items.

  Creates a menu in the SpreadSheet UI to perform script functionalities.
*/
function createMenu(libName) {
  const ui = SpreadsheetApp.getUi()
  if (libName.length != 0) libName = libName + '.'

  ui.createMenu('Sheet Automation')
    .addItem('Automate sheets', `${libName}startScript`)
    .addSeparator()
    .addItem('Set Handles', `${libName}setHandles`)
    .addToUi();
}

/*
  Prompts input fields for `Codeforces` and `UVA` handles.
  If user entered none, nothing will be generated.
  User can pass only one handle or both.

  After getting input, a new sheet is inserted `Script:MetaData`
  with user input and some decoration.
*/
function setHandles() {
  const cfHandle = promptForHandle('Codeforces', 'CF')
  const uvaHandle = promptForHandle('UVA', 'UVA')

  if (cfHandle == "" && uvaHandle == "") {
    Browser.msgBox("You have NOT entered any handle\\nNo metadata will be generated!")
    return;
  }

  var metaDataSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Script:MetaData");

  if (metaDataSheet == null) 
      metaDataSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet();

  metaDataSheet.setName("Script:MetaData");

  metaDataSheet.getRange(1, 1, 1, 3).setValues([["Don't change/delete this metadata", '','']]).setHorizontalAlignment("center").merge().setBackgroundRGB(255,0,0)
  metaDataSheet.getRange(2, 1, 1, 3).setValues([['CF Handle', 'UVA Handle','Problems Sheet Name (Seperated by \',\')']]).setHorizontalAlignment("center").setBackgroundRGB(255,255,0)
  metaDataSheet.getRange(3, 1, 1, 3).setValues([[cfHandle, uvaHandle,'A,B,C1,C2,D1,D2,D3']]).setHorizontalAlignment("center")

  const maxRows = metaDataSheet.getMaxRows();
  const lastRow = metaDataSheet.getLastRow();
  if (maxRows != lastRow)
    metaDataSheet.deleteRows(lastRow + 1, maxRows - lastRow);

  const maxColumns = metaDataSheet.getMaxColumns();
  const lastColumn = metaDataSheet.getLastColumn();
  if (maxColumns != lastColumn)
    metaDataSheet.deleteColumns(lastColumn + 1, maxColumns - lastColumn);
  
  Browser.msgBox("Great! Now you can use the add-on by clicking 'Automate current sheet'")
}

/*
  Asks user for given handle
  returns the response. 

  @params name: The name of the required handle
  @params abbr: The abbreviation of the website.
*/
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

/*
  Prompts an error when wrong handle is passed.

  @params handle: The wrong handle
  @params which: Website abbreviation
*/
function handleError(handle, which) {
  Browser.msgBox(`Oops, you have just entered wrong handle! \\n${which}:${handle}`)
}