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
//-------------------------------------------------------------------------------------
/*
 * /task-submit, タスク詳細画面からのpostリクエスト, 課題の提出
*/
const multer = require('multer')
// static built-in middleware
app.use(express.static('temp'))
// multer middleware
//const upload = multer({ dest: 'uploads/' })
//const upload = multer({ dest: './uploads/'})
//アップロードされたファイルを一時的に保存するフォルダへのパス名
const updir = "./uploads/"
//note:ファイルをアップロードするときはreq.body(json)に"id"が共に送信されているものとする
const storage = multer.diskStorage({
  destination: (req, file, callback) =>{
    callback(null, updir);
  },
  filename: (req, file, callback) =>{
    const unixTime = new Date().getTime();
    //const fileName = `${unixTime}_${file.originalname}`;
    const fileName = `${req.body.id}_${file.originalname}`;
    callback(null, fileName)
  },
})
const upload = multer({storage})
//app.post("/task-submit", upload.single("pdf"), async  (req, res) => {
app.post("/task-submit", upload.array("pdf"), async  (req, res) => {
  console.log("rec\t: request /task-submit\n");
  //console.log(req.body)
  let file_list =req.files
  console.log(file_list)
  console.log(req.files.length)
  console.log(req.body)
  
  for(let i = 0; i < file_list.length; i++) {
    let newName = `${updir}${req.body.id}_${req.files[i].originalname}`;
    fs.renameSync(file_list[i].path, newName);  // 長い一時ファイル名を元のファイル名にリネームする。
    console.log(file_list[i])
  }
    
  //console.log(req.file)
  /*
  upload(req, res, (err) => {
      if (err) {
        throw err
      }

      console.log('/test1')
      console.log(req.headers['content-type'])
      console.log('* body')
      console.log(req.body)
      console.log('* files')
      console.log(req.files)

      res.status(200).json({ message: 'OK' })
    })
/*
  console.log(req.body)
  console.log(typeof req.body.pdf)
  console.log(req.body.pdf)
  console.log(req.arrayBuffer())
  var pdf_content ;
  //console.log(toBlob(req.body.pdf))

  let sql =`UPDATE tasks SET `;
  let keys = Object.keys(req.body);
  let values = Object.values(req.body);
  for (let i = 0; i < keys.length; i++) {
    if (keys[i] == 'id') {
      values[i] = values[i];
    }else if(keys[i] == 'submittedFlag'){
      values[i] = values[i]==0? 'false':'true';
    }else{
      values[i] = "'"+values[i]+"'";
    }
    
  }
  for (let i = 0; i < keys.length; i++) {
    if (keys[i] != "pdf") {
      sql = sql + `'${keys[i]}' = '${values[i]}' `;
      //console.log(`${keys[i]} : ${values[i]}`)
    }else{
      sql = sql + `'${keys[i]}' = ${values[i]} `;
    }
    
  }
  sql += `WHERE id = ${req.body.id}`;
  //console.log("sql : "+sql)
  /*
  new Promise((resolve) => {

    
    connection.query(sql, function (err, result, fields) {  
      if (err) throw err;  
      console.log("after sql")
      console.log(result)
      console.log("get task");
      resolve(result);
    });

  })
  .then((task) => {
    console.log("send task");
    console.log(task)
    res.json(task)
  });
  */
});
function toBlob(base64) {
  var bin = atob(base64.replace(/^.*,/, ''));
  var buffer = new Uint8Array(bin.length);
  for (var i = 0; i < bin.length; i++) {
      buffer[i] = bin.charCodeAt(i);
  }
  // Blobを作成
  try{
      var blob = new Blob([buffer.buffer], {
          type: 'application/json'
      });
  }catch (e){
      return false;
  }
  return blob;
}
//-------------------------------------------------------------------------------------
/*
 * /task-detail, タスク詳細画面からのpostリクエスト
*/
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
  .then((task) => {
    console.log("send task");
    console.log(task)
    res.json(task)
  });
  
});
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
      if( a.task_name < b.task_name ){ r = -1; }
      else if( a.task_name > b.task_name ){ r = 1; }
      return r;
    })
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


