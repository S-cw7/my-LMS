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
 * express
*/

const express = require("express");
const app = express();
//app.use(express.json())
//const bodyParser = require('body-parser');
const mysql = require("mysql");
const fs = require("fs");


const port = process.env.PORT || 3000;
var connection = mysql.createConnection({
  host: 'localhost',
  user    : 'root',
  password: 'maresoya@l4o7ll',
  database: 'my_lms'
});

app.set('port', port);
app.set("view engine", "ejs");

//app.use(bodyParser.json());
//@
//app.use(express.urlencoded({ extended: true }));
//@
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTION"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});


let task_list;
app.listen(port, () => console.log(`App started on port ${port}.`));
/*
 * getリクエスト, データベースへの読み込み, レスポンスを返す
*/
app.get("/task", (req, res) => {
  /*resTaskList(res)*/
  console.log("send : task list\n");
  /*res.render("test", { name: "Yamada" });*/
  res.json({ "hello": "taro" })
  //res.send("comfirm server to client")

});
function resTaskList(res){
  connection.connect((err) =>{
    if (err) throw err;
    console.log("Successed in connection as id");
    var pdf_content = fs.readFileSync("test.pdf");
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
      task_list = result;
      console.log("fin : read task_list from mySQL");
      //console.log(typeof result[0]['pdf'])
      console.log(task_list)
      
    });   
  })
  
}
app.post("/register", (req, res) => {
  console.log("Fin : Receive register-task request\n");
  console.log(req.body);
  registerTask(req.body);
  /*res.render("test", { name: "Yamada" });*/
});

/*
 * get(/task)用
*/
function getTaskList(callback){
  connection.connect((err) =>{
    if (err) throw err;
    console.log("Successed in connection as id");
    var pdf_content = fs.readFileSync("test.pdf");
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
      task_list = result;
      //console.log(typeof result[0]['pdf'])
  
    });
  
    console.log("fin : read task_list from mySQL");
  
  })
  callback()
}
/*
 * post(/register)用
*/
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
  console.log("fin : insert", end="")
  console.log(task)
  
}

function checkTask(task){
  if(task.submittedFlag = null) task.submittedFlag=false;
  /*
  Object.keys(task).map((key) => {
    console.log('key:' + key + '\tvalue:' + task[key]);
  });
  */
  return task;
}
/*
var deadLine  = new Date('1991-02-04:22:15:18').toLocaleString()
var submittedDate  = new Date('2002-02-04:22:15:18').toLocaleString()
task = {
  id: 4,
  submittedFlag : false,
  name: '期末試験',
  deadLine : null,
  submittedDate: submittedDate,
  pdf: null,
  text: '完了'
}
task['deadline'] = deadLine
*/

/*
app.get("/", (req, res) => {
  
});
*/
