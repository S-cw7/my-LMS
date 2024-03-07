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
/*
 * 共通設定など
*/
const express = require("express");
const app = express();
const mysql = require("mysql");
const fs = require("fs");
const port = process.env.PORT || 3000;
app.set('port', port);
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTION"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
var connection = mysql.createConnection({
  host: 'localhost',
  user    : 'root',
  password: 'maresoya@l4o7ll',
  database: 'my_lms'
});

let task_list;
getTaskList()

/*
 * getリクエスト, データベースへの読み込み, レスポンスを返す
*/
app.get("/task",  async (req, res) => {
  console.log("rec\t: request /\n");
  //getTaskList()
  //const result = await getTaskListRes()
  new Promise((resolve) => {
    getTaskList()
    console.log("get task_list");
    resolve();
  }).then(() => {
    console.log("send task_list");
    res.json(task_list)
  });
  
});
/*
 * タスクの登録
*/
app.post("/register", (req, res) => {
  console.log("Fin : Receive register-task request\n");
  console.log(req.body);
  registerTask(req.body);
  /*res.render("test", { name: "Yamada" });*/
});
/*
 * サーバーの開始
*/
app.listen(port, () => console.log(`App started on port ${port}.`));

function getTaskListRes(){
  return new Promise(getTaskList());
}
function getTaskList(){
  const sql = "select * from tasks"
  connection.query(sql, function (err, result, fields) {  
    if (err) throw err;  
    console.log(result)
    result.sort(function(a, b) {
      var r = 0;
      if( a.task_name < b.task_name ){ r = -1; }
      else if( a.task_name > b.task_name ){ r = 1; }
      return r;
    })
    console.log(result)
    task_list = result;
    //console.log(typeof result[0]['pdf'])

  });

  console.log("fin");

/*
  connection.connect((err) =>{
    if (err) throw err;
    console.log("Successed in connection as id");
    //var pdf_content = fs.readFileSync("test.pdf");
    const sql = "select * from tasks"
    connection.query(sql, function (err, result, fields) {  
      if (err) throw err;  
      console.log(result)
      result.sort(function(a, b) {
        var r = 0;
        if( a.task_name < b.task_name ){ r = -1; }
        else if( a.task_name > b.task_name ){ r = 1; }
        return r;
      })
      console.log(result)
      task_list = result;
      //console.log(typeof result[0]['pdf'])
  
    });
  
    console.log("fin");
  
  })
*/
}
