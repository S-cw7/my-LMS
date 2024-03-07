/*
 * express
*/
let task = {
  id: 3,
  name: '第12回　ノート',
  category: '電子回路',
  deadline: "2024-01-01T14:59:00.000Z",
  submittedFlag: 0,
  submittedDate: null,
  pdf: null,
  text: null
}; 

const express = require("express");
const app = express();

const port = process.env.PORT || 3000;
app.set('port', port);
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

/*
 * getリクエスト, データベースへの読み込み, レスポンスを返す
*/
app.get("/task", (req, res) => {
  console.log("rec\t: request /\n");
  res.json(task)
});
/*
 * サーバーの開始
*/
app.listen(port, () => console.log(`App started on port ${port}.`));
