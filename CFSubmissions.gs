function fetchCFSubmissions(handle) {
  var responseData
  try {
    const response = UrlFetchApp.fetch(`https://codeforces.com/api/user.status?handle=${handle}`)
    responseData = JSON.parse(response.getContentText())
  } catch {
    handleError()
    return
  }
  
  if (responseData.status != 'OK') {
    handleError()
    return
  }
  
  var submissions = extractCF(responseData.result)

  setCFColumn(submissions)  
}

function extractCF(result) {
  var submissions = new Map()
  for (problem in result) {
    var data = result[problem]
    var problemId = data.problem.contestId + data.problem.index
    var verdict = getProblemVerdict(data.verdict)
    if (submissions.has(problemId)) {
      if (submissions.get(problemId) != 'AC')
        submissions.set(problemId, verdict)
    } else 
      submissions.set(problemId, verdict)
  }
  return submissions
}

function setCFColumn(submissions) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet()
  var sourceRange = sheet.getRange(1, 2, sheet.getLastRow());

  var sourceData = sourceRange.getFormulas();
  for (row in sourceData) {
    var data = sourceData[row][0].toString()

    const matcher = data.match(/"[^,]+"/g)
    if (matcher == null) continue

    const url = matcher[0]
    if (url.includes("codeforces")) {
      const splitter = url.split('/')
      const contestId = splitter[splitter.length - 3]
      const problemIndex = splitter[splitter.length - 1].slice(0, -1)
      
      const problemId = contestId + problemIndex
      const verdict = submissions.get(problemId) ? submissions.get(problemId) : ''
      sheet.getRange(parseInt(row) + 1, 3).setValue(verdict)
    }
  }
}

function getProblemVerdict(verdict) {
  switch (verdict) {
    case 'OK':
      return 'AC'
    // case 'COMPILATION_ERROR':
    //   return 'CE'
    // case 'RUNTIME_ERROR':
    //   return 'RE'
    // case 'TIME_LIMIT_EXCEEDED':
    //   return 'TLE'
    // case 'MEMORY_LIMIT_EXCEEDED':
    //   return 'MLE'
    default:
      return 'WA'
  }
}

function getContestId(data) {
  var idx = 2
  var answer = ""
  while (data[idx] != '-') answer += data[idx++]
  return answer
}

function getProblemIndex(data) {
  return data[data.length - 1]
}
