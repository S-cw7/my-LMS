const express = require('express');
const app = express();

//関数の意味、reqとは
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});


const mysql = require("mysql");
const fs = require("fs");

var connection = mysql.createConnection({
  host: 'localhost',
  user    : 'root',
  password: 'maresoya@l4o7ll',
  database: 'my_lms'
});

connection.connect((err) =>{
  if (err) throw err;
  console.log("Successed in connection as id");
  
  var pdf_content = fs.readFileSync("test.pdf");

  /*
  const in_sql = "insert into test values ('', '期末試験', '', '完了');"
  connection.query(in_sql, function (err, result, fields) {  
    if (err) throw err;  
    console.log(result)
  });
  */

  var deadline  = new Date('2024-03-04:23:59:00').toLocaleString()
  var submittedDate  = new Date('2024-03-10:23:59:00').toLocaleString()  
  connection.query('insert into tasks set ?', { 
    submittedFlag : true,
    name: '中間試験',
    deadLine : deadline,
    submittedDate: submittedDate,
    pdf: pdf_content,
    text: '終了'
  }, function( error, result ){
      if (err) throw err;  
      console.log(result)
  })
  
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
    //console.log(typeof result[0]['pdf'])

	});

  console.log("fin");

})
