/*
  Stores number of problems solved today.
*/
let solvedToday

/*
  Fires the actual script to map submissions with `Status` and `Submit count` columns
*/
function startScript() {
  solvedToday = 0
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Script:MetaData')

  if (sheet == null) {
    guide()
        sheet = SpsetHandlesheetApp.getActiveSpreadsheet().getSheetByName('Script:MetaData')
    if (sheet == null) return;
  }

  const lastRow = sheet.getLastRow()

  const cfHandle = sheet.getRange(lastRow, 1).getValue()
  const uvaHandle = sheet.getRange(lastRow, 2).getValue()

  const cfSubmissions = fetchCFSubmissions(cfHandle)
  const uvaSubmissions = fetchUVASubmissions(uvaHandle)

  setStatusColumn(cfSubmissions, uvaSubmissions)
}

/*
  Change Column 3 (Status) and Column 4 (Submit count) depending on user's submissions.

  @params cfSubmissions: Map of user's Codeforces submissions
  @params uvaSubmissions: Map of user's UVA submissions
*/
function setStatusColumn(cfSubmissions, uvaSubmissions) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet()
  var sourceRange = sheet.getRange(1, 2, sheet.getLastRow());

  solvedToday = 0
  var sourceData = sourceRange.getFormulas();
  for (row in sourceData) {
    var data = sourceData[row][0].toString()

    const matcher = data.match(/"[^,]+"/g)
    if (matcher == null) continue

    const url = matcher[0]
    if (!url.includes("codeforces") && !url.includes("uva")) continue

    const problemId = getProblemIdFromUrl(url)
    const result = getResultFromProblemId(problemId, cfSubmissions, uvaSubmissions)
    sheet.getRange(parseInt(row) + 1, 3, 1, 2).setValues([result]).setHorizontalAlignment("center")
    //sheet.getRange(parseInt(row) + 1, 3).setRichTextValue(result[0]).setHorizontalAlignment("center")
    //sheet.getRange(parseInt(row) + 1, 4).setValue(result[1]).setHorizontalAlignment("center")
  }
  sheet.getRange(2, 1).setValue(`Solved today: ${solvedToday}`)
}

/*
  @params url: String of problem link.

  returns problemId from given Url
*/
function getProblemIdFromUrl(url) {
  if (url.includes("codeforces")) {
    const splitter = url.split('/')
    const contestId = url.match(/(\d+)/g)
    const problemIndex = splitter[splitter.length - 1].slice(0, -1)
    return contestId + problemIndex
  } else if (url.includes("uva"))
    return parseInt(url.substr(parseInt(url.search('problem=')) + 8).slice(0, -1));
}

/*
  @params problemId: The id of the problem
  @params cfSubmissions: Map of codeforces submissions (By problemId)
  @params UVA: Map of UVA submissions (By problemId)
  
  returns [verdict] and [count] of the given problem 
*/
function getResultFromProblemId(problemId, cfSubmissions, uvaSubmissions) {
  let verdict = '', count = '', timestamp
  if (cfSubmissions.has(problemId)) {
    count = cfSubmissions.get(problemId).count
    verdict = cfSubmissions.get(problemId).verdict
    timestamp = cfSubmissions.get(problemId).timestamp
    submissionsLink = cfSubmissions.get(problemId).link
    verdict = `=HYPERLINK("${submissionsLink}","${verdict}")`;
    //verdictWithLink = SpreadsheetApp.newRichTextValue().setText(verdict).setLinkUrl(submissionsLink).build();
  } else if (uvaSubmissions.has(problemId)) {
    count = uvaSubmissions.get(problemId).count
    verdict = uvaSubmissions.get(problemId).verdict
    timestamp = uvaSubmissions.get(problemId).timestamp
  }

  if (verdict == 'AC' && isSolvedToday(timestamp)) solvedToday++

  return [verdict, count]
}

/*
  @params timestamp: The time (in Unix-format) when the problem was solved.

  Returns wether the problem is solved today or not.
*/
function isSolvedToday(timestamp) {
  const today = new Date().setHours(0, 0, 0, 0);
  const solvedDay = new Date(timestamp * 1000).setHours(0, 0, 0, 0);
  return today === solvedDay
}

