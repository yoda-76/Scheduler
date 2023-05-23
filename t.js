var xsls = require("xlsx")
var wb=xsls.readFile("./schedule.xls")
let ws=wb.Sheets[wb.SheetNames[0]]
console.log(ws)