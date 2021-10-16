function fetchUVASubmissions(handle) {
  var userID
  try {
    const response = UrlFetchApp.fetch(`https://uhunt.onlinejudge.org/api/uname2uid/${handle}`)
    userID = JSON.parse(response.getContentText())
  } catch {
    handleError()
    return
  }

  if (userID == 0) {
    handleError()
    return
  }
  
  extractUVA(userID)
}

function extractUVA(userID) {
  var responseData
  try {
    const response = UrlFetchApp.fetch(`https://uhunt.onlinejudge.org/api/subs-user/${userID}`)
    responseData = JSON.parse(response.getContentText()).subs
  } catch {
    handleError()
    returnextractCF
  } 
  // index 1: ProblemID, index 2: verdict
  const submissions = getSubmissions(responseData)

  setUVAColumn(submissions)
}

function setUVAColumn(submissions) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet()
  var sourceRange = sheet.getRange(1, 2, sheet.getLastRow());

  var sourceData = sourceRange.getFormulas();
  for (row in sourceData) {
    var data = sourceData[row][0].toString()
    const matcher = data.match(/"[^,]+"/g)
    if (matcher == null) continue

    const url = matcher[0]
    if (url.includes("uva")) {
      const problemID = parseInt(url.substr(parseInt(url.search('problem=')) + 8).slice(0, -1));
      const verdict = submissions.get(problemID) ? submissions.get(problemID) : ''
      sheet.getRange(parseInt(row) + 1, 3).setValue(verdict)
    }
  }
}

function getSubmissions(result) {
  const submissions = new Map()
  result.forEach((el) => {
    const problemID = el[1]
    const verdict = getVerdict(el[2]) 
    if (submissions.has(problemID)) {
      if (submissions.get(problemID) != 'AC')
        submissions.set(problemID, verdict)
    } else
      submissions.set(problemID, verdict)
  })

  return submissions
}

function getVerdict(verdict) {
  /* From UVA API:
    10 : Submission error
    15 : Can't be judged
    20 : In queue
    30 : Compile error
    35 : Restricted function
    40 : Runtime error
    45 : Output limit
    50 : Time limit
    60 : Memory limit
    70 : Wrong answer
    80 : PresentationE
    90 : Accepted 
  */
  switch (verdict) { 
    case 90:
      return 'AC'
    default: 
      return 'WA'
  }
}




