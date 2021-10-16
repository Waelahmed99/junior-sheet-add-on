function onInstall(e) {
  onOpen(e)
}

function onOpen(e) {
    const ui = SpreadsheetApp.getUi();
    ui.createMenu('Sheet automation')
      .addItem('Fetch Codeforces', 'fetchCodeforces')
      .addItem('Fetch UVA', 'fetchUVA')
      .addItem('About', 'about')
      .addToUi();
}

function fetchCodeforces() {
  var ui = SpreadsheetApp.getUi();
  var handle = ui.prompt("Please enter your handle");
  fetchCFSubmissions(handle.getResponseText())
}

function fetchUVA() {
  var ui = SpreadsheetApp.getUi();
  var handle = ui.prompt("Please enter your handle");
  fetchUVASubmissions(handle.getResponseText())
}

function about() {
    const ui = SpreadsheetApp.getUi();

    var result = ui.alert(
     'Follow me on GitHub?',
     'This add-on is developed by Wael Ahmed',
      ui.ButtonSet.YES_NO)
    
    if (result == ui.Button.YES) {
      var html = HtmlService.createHtmlOutputFromFile("index");
      html.setWidth(90).setHeight(1);
      ui.showModalDialog(html, "Opening ..." );
    }
}

function getUrl() {
  return 'https://github.com/Waelahmed99/'
}

function handleError() {
  Browser.msgBox("Oops, you have just entered wrong handle!")
}
