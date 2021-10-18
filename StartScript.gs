function startScript(specific = null) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Info')
  const lastRow = sheet.getLastRow()

  const cfHandle = sheet.getRange(lastRow, 1).getValue()
  const uvaHandle = sheet.getRange(lastRow, 2).getValue()
  
  const cfSubmissions = fetchCFSubmissions(cfHandle)
  const uvaSubmissions = fetchUVASubmissions(uvaHandle)

  var sheetsNames = ['A', 'B', 'C1', 'C2', 'D1', 'D2', 'D3']
  if (specific != null) sheetsNames = [specific] 

  for (var index in sheetsNames)
    setStatusColumn(cfSubmissions, uvaSubmissions, sheetsNames[index])
}

function setStatusColumn(cfSubmissions, uvaSubmissions, sheetName) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName)
  var sourceRange = sheet.getRange(1, 2, sheet.getLastRow());

  var sourceData = sourceRange.getFormulas();
  for (row in sourceData) {
    var data = sourceData[row][0].toString()

    const matcher = data.match(/"[^,]+"/g)
    if (matcher == null) continue

    const url = matcher[0]
    if (url.includes("codeforces") && !cfSubmissions.has('error'))
      sheet.getRange(parseInt(row) + 1, 3).setValue(getCFVerdict(url, cfSubmissions))
    else if (url.includes("uva") && !uvaSubmissions.has('error')) 
      sheet.getRange(parseInt(row) + 1, 3).setValue(getUVASubmission(url, uvaSubmissions))

  }
}

function getCFVerdict(url, submissions) {
  const splitter = url.split('/')
  const contestId = url.match(/(\d+)/g)
  const problemIndex = splitter[splitter.length - 1].slice(0, -1)

  const problemId = contestId + problemIndex
  return submissions.get(problemId) ? submissions.get(problemId) : ''
}

function getUVASubmission(url, submissions) {
  const problemID = parseInt(url.substr(parseInt(url.search('problem=')) + 8).slice(0, -1));
  return submissions.get(problemID) ? submissions.get(problemID) : ''
}


