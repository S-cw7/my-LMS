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
/*
 * 以下の2つはapp.getやpostメソッドのreq.bodyをパースするのに必要なミドルウェア
*/
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

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
  registerTask(req.body);

});
/*
 * サーバーの開始
*/
app.listen(port, () => console.log(`App started on port ${port}.`));

/*
 * データベースからtask_listを取得する関数
*/
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


function registerTask(task){
  task = checkTask(task);
  connection.query('insert into tasks set ?', { 
    submittedFlag : task["submittedFlag"],
    name: task["name"],
    category: task["category"],
    deadLine : task["deadline"],
    submittedDate: null,
    pdf: null,
    text: null
  }, function( error, result ){
      if (error) throw error;  
      console.log(result)
  })
  
  console.log("fin : register", end="")
  console.log(task)
  
}
/*
 * データベースに登録するtaskが条件を満たしているかを確認する関数。
 * taskの初期値も設定する
*/
function checkTask(task){
  if(task.submittedFlag == null) task.submittedFlag=false;
  /*
  Object.keys(task).map((key) => {
    console.log('key:' + key + '\tvalue:' + task[key]);
  });
  */
  return task;
}




