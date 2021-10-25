/*
  Get UVA userID from UVA request `https://uhunt.onlinejudge.org/api/uname2uid/${handle}`

  @params handle: The user passed handle.

  returns map of submissions.
*/
function fetchUVASubmissions(handle) {
  if (handle == "") return new Map([['error', 'no handle']])
  var userID
  try {
    const response = UrlFetchApp.fetch(`https://uhunt.onlinejudge.org/api/uname2uid/${handle}`)
    userID = JSON.parse(response.getContentText())
  } catch {
    handleError(handle, 'UVA')
    return new Map([['error', 'bad request']])
  }

  if (userID == 0) {
    handleError(handle, 'UVA')
    return new Map([['error', 'wrong handle']])
  }
  
  return extractUVA(userID)
}

/*
  Fetch UVA submissions from the api request `https://uhunt.onlinejudge.org/api/subs-user/${userID}`

  @params userID: UserID at UVA from his handle.

  returns map of submissions.
*/
function extractUVA(userID) {
  var responseData
  try {
    const response = UrlFetchApp.fetch(`https://uhunt.onlinejudge.org/api/subs-user/${userID}`)
    responseData = JSON.parse(response.getContentText()).subs
  } catch {
    handleError(userID, 'UVA')
    return new Map([['error', 'bad request']])
  } 
  // index 1: ProblemID, index 2: verdict, index 4: timestamp
  const submissions = getSubmissions(responseData)

  return submissions
}

/*
  Extracts submissions from UVA json list, to map of problem ids'

  @params result: result of UVA submissions request

  returns map of submissions.
*/
function getSubmissions(result) {
  const submissions = new Map()
  result.forEach((el) => {
    const problemID = el[1]
    const verdict = getVerdict(el[2]) 
    if (submissions.has(problemID)) {
      const count = parseInt(submissions.get(problemID).count) + 1
      if (submissions.get(problemID).verdict != 'AC')
        submissions.set(problemID, {verdict: verdict, timestamp: el[4], count: count})
    } else
      submissions.set(problemID, {verdict: verdict, timestamp: el[4], count: 1})
  })

  return submissions
}

/*
  Returns the verdict text of the problem

  @params verdict: The actual verdict from UVA response

  returns verdict text. 
*/
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
    case 40:
      return 'RTE'
    case 50:
      return 'TLE'
    case 60:
      return 'MLE'
    default: 
      return 'WA'
  }
}




