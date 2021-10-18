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

function extractUVA(userID) {
  var responseData
  try {
    const response = UrlFetchApp.fetch(`https://uhunt.onlinejudge.org/api/subs-user/${userID}`)
    responseData = JSON.parse(response.getContentText()).subs
  } catch {
    handleError(userID, 'UVA')
    return new Map([['error', 'bad request']])
  } 
  // index 1: ProblemID, index 2: verdict
  const submissions = getSubmissions(responseData)

  return submissions
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




