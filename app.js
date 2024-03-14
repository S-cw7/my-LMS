/*
 * express
*/
/*
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
*/
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
app.use(express.json({limit: '10mb' })) // for parsing application/json
//app.use(express.urlencoded({ extended: true , limit: '10mb' })) // for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true})) // for parsing application/x-www-form-urlencoded

var connection = mysql.createConnection({
  host: 'localhost',
  user    : 'root',
  password: 'maresoya@l4o7ll',
  database: 'my_lms'
});
connection.connect((err) => {
  if (err) {
    console.log('error connecting: ' + err.stack);
    return;
  }
  console.log('success');
});
//-------------------------------------------------------------------------------------
/*
 * タスク情報を受け取って、
 * req.body = {全て？}, 必要なタスク情報はidのみ
*/
app.post("/delete-task", (req, res) => {
  console.log("rec\t: request /delete-task\n");
  console.log(req.body)

  connection.query(
    'DELETE FROM tasks WHERE id = ?',
    [req.body.id], 
    function( err, result ){
       if (err) {
        res.json({deleteFlag : false})
        throw err; 
       }else{
        console.log(result)
        res.json({deleteFlag : true})
       } 
       
  })

})
//-------------------------------------------------------------------------------------
/*
 * 一括削除依頼を処理する
 * タスク情報を受け取って、
 * req.body = {全て？}, 必要なタスク情報はidのみ
*/
app.post("/batch-delete-task", (req, res) => {
  console.log("rec\t: request /batch-delete-task\n");
  console.log(req.body)

  connection.query(
    'DELETE FROM tasks WHERE id IN (?)',
    [req.body], 
    function( err, result ){
       if (err) {
        res.json({deleteFlag : false})
        throw err; 
       }else{
        console.log(result)
        res.json({deleteFlag : true})
       } 
       
  })

})
//-------------------------------------------------------------------------------------
/*
 * /task-submit, タスク詳細画面からのpostリクエスト, 課題の提出
 * 与えられるタスク情報はidと、(pdf, text)を含むjsonを含むformDataである
 * req.body = {id, (pdf), (text)}, , 必要なタスク情報はid, (pdf, text)のみ
*/
// static built-in middleware
//app.use(express.static('temp'))
// multer middleware
const multer = require('multer')
//アップロードされたファイルを一時的に保存するフォルダへのパス名
const updir = "./uploads/"
//note:ファイルをアップロードするときはreq.body(json)に"id"が共に送信されているものとする
const storage = multer.diskStorage({
  destination: (req, file, callback) =>{
    callback(null, updir);
  },
  filename: (req, file, callback) =>{
    //名前の変更、"id_元のファイル名"
    const unixTime = new Date().getTime();
    const fileName = `${req.body.id}_${file.originalname}`;
    callback(null, fileName)
  },
})
const upload = multer({storage})
app.post("/task-submit", upload.array("pdf"), async  (req, res) => {

  console.log("rec\t: request /task-submit\n");
  let file_list =req.files
  console.log(file_list)
  console.log(req.files.length)
  console.log(req.body)

  //console.log("fileName : "+updir+req.files[0].filename)
  //console.log("fileName : "+updir+req.files[0].path)
  let new_task = req.body;
  new_task.deadline = changeToMySqlDatetime(new_task.deadline)
  new_task.submittedDate = changeToMySqlDatetime(new_task.submittedDate)
  let update_task = {};
  if(new_task["text"].length > 0){
    //テキストが入力されていれば、それを更新する
    //もし1文字以上入力されていなければ、前のデータのまま
    update_task["text"] = new_task["text"]
  }
  if(file_list.length > 0){
    //ファイルが入力されていれば、それを更新する
    //もし1文字以上入力されていなければ、前のデータのまま
    update_task["pdf"] =  fs.readFileSync(updir+file_list[0].filename);
  }
  
  if(Object.keys(update_task).length > 0){
    //テキストorファイルが送信されると、提出済みにする
    //データを更新する
    update_task["submittedFlag"] = true;
    update_task["submittedDate"] = new_task["submittedDate"];
    connection.query(
      'UPDATE tasks SET ? WHERE id = ?',
      [update_task,  req.body.id], 
      function( err, result ){
          if (err) throw err;  
          console.log(result)
    })
    console.log(" > succeeded to update")
  }else{
    console.log(" > failed to update")
  }
  res.end();
});

app.post("/update-task", async  (req, res) => {

  console.log("rec\t: request /update-task\n");
  console.log(req.body)

  let new_task = req.body;
  let update_task = {};
  update_task.name = new_task.name
  update_task.category = new_task.category
  update_task.deadline = changeToMySqlDatetime(new_task.deadline)

  //データを更新する
  connection.query(
    'UPDATE tasks SET ? WHERE id = ?',
    [update_task,  req.body.id], 
    function( err, result ){
        if (err) throw err;  
        console.log(result)
  })
  console.log(" > succeeded to update")
  res.end();
});


/*
 * new Date().toJSON/.toISOString()の返り値、"YYYY-MM-DDThh:mm:ssZ"という形式の文字列を
 * mySQLのdatetime型である"YYYY-MM-DD hh:mm:ss"の形式の文字列に変換する
*/
function changeToMySqlDatetime(old_datetime) {
  let new_datetime = old_datetime.replace("T", " ");
  return new_datetime.replace("Z", "");
}  

//-------------------------------------------------------------------------------------
/*
 * /task-detail, タスク詳細画面からのpostリクエスト
*/
let getted_task;
app.post("/task-detail", async  (req, res) => {
  console.log("rec\t: request /task-detail\n");
  new Promise((resolve) => {
    const sql = "select * from tasks where id="+req.body.id
    console.log("sql : "+sql)
    connection.query(sql, function (err, result, fields) {  
      if (err) throw err;  
      console.log("after sql")
      console.log(result)
      console.log("get task");
      resolve(result);
    });
  })
  .then((task)=>{
    console.log("send task.pdf")
    //console.log(task[0].pdf)
    getted_task = task;
    res.json(task)

  })

  
});
app.get("/task-detail-file",(req, res) => {
  console.log("rec\t: request /task-detail-file\n");
  console.log("send task.pdf")
  console.log(getted_task[0].pdf)
  res.send(getted_task[0].pdf)
})
//-------------------------------------------------------------------------------------
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
 * データベースからtask_listを取得する関数
*/
function getTaskList(){
  const sql = "select * from tasks"
  connection.query(sql, function (err, result, fields) {  
    if (err) throw err;  
    console.log(result)
    result.sort(function(a, b) {
      var r = 0;
      var a_date = new Date(a.deadline)
      var b_date = new Date(b.deadline)
      if( a_date < b_date ){ r = -1; }
      else if( a_date > b_date ){ r = 1; }
      return r;
    })
    /*
    result.sort(function(a, b) {
      var r = 0;
      if( a.task_name < b.task_name ){ r = -1; }
      else if( a.task_name > b.task_name ){ r = 1; }
      return r;
    })
    */
    console.log(result)
    task_list = result;
    //console.log(typeof result[0]['pdf'])

  });

  console.log("fin");

}
//-------------------------------------------------------------------------------------
/*
 * タスクの登録
*/
app.post("/register", (req, res) => {
  console.log("Fin : Receive register-task request\n");
  registerTask(req.body);
  //TODO : データベースに登録できなかった場合
  res.end();
});


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
//-------------------------------------------------------------------------------------
/*
 * サーバーの開始
*/
app.listen(port, () => console.log(`App started on port ${port}.`));


