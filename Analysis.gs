function createAnalysis() {
  var mp = new Map();
  analysisTimestamps.forEach(v =>
    function () {
      v = convertUnixTimeToDate(v)
      var oldCount = 0;
      if (mp.has(v)) oldCount = mp.get(v);
      mp.set(v, oldCount + 1);
    }()
  )




  var analysisSheet = SpreadsheetApp.getActive().getSheetByName(analysisSheetName);
  if (analysisSheet == null) {
    analysisSheet = SpreadsheetApp.getActive().insertSheet().setName(analysisSheetName);
  }
  analysisSheet.getRange(1, 2, 1, 2).setValues([["Date", "Solved"]]).setHorizontalAlignment("center");
  //delete all data in analysis sheet
  if (analysisSheet.getMaxRows() - 1 > 1)
    analysisSheet.deleteRows(2, analysisSheet.getMaxRows() - 1);
  if (analysisSheet.getMaxColumns() - 3 >= 1)
    analysisSheet.deleteColumns(4, analysisSheet.getMaxColumns() - 3);

  //insert extra rows to fit the number of days 
  var numberOfRowsToAdd = mp.size - analysisSheet.getMaxRows() + 1;
  if (numberOfRowsToAdd > 0)
    analysisSheet.insertRowsAfter(analysisSheet.getMaxRows(), numberOfRowsToAdd);

  var data = analysisSheet.getRange(1, 1, analysisSheet.getMaxRows(), analysisSheet.getMaxColumns()).getValues();
  var i = 1;
  for (var cur of mp) {
    data[i][0] = `=DATEVALUE("${cur[0]}")`; //used to sort the date 
    data[i][1] = cur[0];
    data[i][2] = cur[1];
    ++i;
  }
  analysisSheet.getRange(1, 1, analysisSheet.getMaxRows(), analysisSheet.getMaxColumns()).setValues(data).setHorizontalAlignment("center");
  //sort data by date
  if (analysisSheet.getLastRow() - 1 > 0)
    analysisSheet.getDataRange().offset(1, 0, analysisSheet.getLastRow() - 1).sort({ column: 1, ascending: false });
  //delete the DATEVALUE column
  analysisSheet.deleteColumn(1);
}

function convertUnixTimeToDate(timestamp) {
  var date = new Date(timestamp * 1000);
  var options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString("en-US", options);
}
