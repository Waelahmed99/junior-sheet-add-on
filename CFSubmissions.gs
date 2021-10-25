/*
  Fetch codeforces submissions from the api request `https://codeforces.com/api/user.status?handle=${handle}`

  @params handle: The user passed handle.

  returns map of submissions.
*/
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

/*
  Extracts submissions from Codeforces json list, to map of problem ids'

  @params result: result of codeforces submissions request

  returns map of submissions.
*/
function extractCF(result) {
  //creationTimeSeconds
  var submissions = new Map()
  for (problem in result) {
    var data = result[problem]
    var problemId = data.problem.contestId + data.problem.index
    var verdict = getProblemVerdict(data.verdict)
    if (submissions.has(problemId)) {
      const count = parseInt(submissions.get(problemId).count) + 1
      if (submissions.get(problemId).verdict != 'AC')
        submissions.set(problemId, {verdict: verdict, timestamp: data.creationTimeSeconds.toString(), count: count})
    } else 
      submissions.set(problemId, {verdict: verdict, timestamp: data.creationTimeSeconds.toString(), count: 1})
  }
  
  return submissions
}

/*
  Returns the verdict text of the problem

  @params verdict: The actual verdict from codeforces response

  returns verdict text. 
*/
function getProblemVerdict(verdict) {
  switch (verdict) {
    case 'OK':
      return 'AC'
    // case 'COMPILATION_ERROR':
    //   return 'CE'
    case 'RUNTIME_ERROR':
      return 'RTE'
    case 'TIME_LIMIT_EXCEEDED':
      return 'TLE'
    case 'MEMORY_LIMIT_EXCEEDED':
      return 'MLE'
    default:
      return 'WA'
  }
}
