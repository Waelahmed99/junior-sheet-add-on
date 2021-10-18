function fetchCFSubmissions(handle) {
  if (handle == "") return new Map([['error', 'no handle']])
  var responseData
  try {
    const response = UrlFetchApp.fetch(`https://codeforces.com/api/user.status?handle=${handle}`)
    responseData = JSON.parse(response.getContentText())
  } catch {
    handleError(handle, 'CF')
    return new Map([['error', 'bad request']])
  }
  
  if (responseData.status != 'OK') {
    handleError(handle, 'CF')
    return new Map([['error', 'wrong handle']])
  }
  
  return extractCF(responseData.result)
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
