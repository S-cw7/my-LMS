//import { changeDateFromStr, StringBreakIntoDateList } from './index.js';
const task_file = document.getElementById('input-file');
const btn_file = document.getElementById('btn-file');
const preview_file = document.getElementById('preview-file');
const task_text = document.getElementById('task-text');
const sndBtn= document.getElementById('submit-button');
const name_element = document.getElementById('name');
const deadline_element = document.getElementById('deadline');
const category_element = document.getElementById('category')

let new_task;
/*
 * ページ読み込み時に、タスクの情報を取得して表示する
*/
fetch("http://127.0.0.1:3000/task-detail", {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(getJsonLocalStrage("selected_task")) 
})
.then((response) =>{
  console.log("Success send")    
  console.log(response);
  return response.json();
} )
.then((task) => {
  //要：エラー処理
  console.log(task)
  new_task = task[0];
  setTaskInfo(task[0])
  return task;
})
.catch((err) => {
  console.log(err)
});

/*
 * 与えられたjson形式のタスクから、タスク情報をセットして表示する
*/
function setTaskInfo(task) {
  if(task == null){
    name_element.innerText = "正しく読み込めませんでした";
    deadline_element.innerText = "期日- ";
    category_element.innerText = "カテゴリ - ";
  }else{
    name_element.innerText = task.name;
  deadline_element.innerText = "期日- "+changeDateFromStr(task.deadline);
  category_element.innerText = "カテゴリ - "+task.category;

  }
  
}
/*
 * index.jsと同じ関数
*/
function changeDateFromStr(deadline){
  let  formatted_deadline = "";
  let date_list = StringBreakIntoDateList(deadline)
  //console.log(date_list)
  if(date_list.length > 0){
    formatted_deadline = date_list[1]
      + '/' +  date_list[2]
      + '/' +  date_list[3]
      + ' ' +  date_list[4]
      + ':' +  date_list[5]
    console.log(date_list);
  }
  //console.log(deadline)
  
  //console.log("formatted_deadline : "+formatted_deadline);
  return formatted_deadline;
}
/*
 * index.jsと同じ関数
*/
function StringBreakIntoDateList(string){
  let date_list = []
  const regrex =  /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).(\d{3})Z/;
  if(regrex.test(string)){
    date_list = string.match(regrex); 
  }
  return date_list;
}

/*
 * localStrageからjsonのデータを取得する
*/
function getJsonLocalStrage(key) {
  let json = JSON.parse(localStorage.getItem(key));
  console.log(json); // true
  console.log(localStorage)
  return json;
}

//-------------------------------------------------------------------------------------
/*
 * 送信ボタンのクリック時の動作
*/
sndBtn.addEventListener('click', ()=>{
  console.log(task_file.files)
  console.log(task_text.value)

  //サーバにアップロード
  console.log(new_task)
  let formData = new FormData();
  let keys = Object.keys(new_task);
  let values = Object.values(new_task);
  //pdf以外のタスク情報を登録
  for (let i = 0; i < keys.length; i++) {
    if(keys[i] != "pdf") formData.append(keys[i], values[i]);
  }
   //ファイル1つしかアップロードできない。複数選択されたときは最初の1つのみをアップロードする
  let file_list = task_file.files
  for (let i = 0; i < file_list.length; i++) {
    formData.append("pdf", file_list[i])
  }
  
  for (let value of formData.entries()) { 
    console.log(value); 
}
  //base64に変換して、
  //let file_reader = new FileReader();
	//file_reader.readAsDataURL(task_file.files[0]);
 
  //new_task.pdf = task_file.files[0];
  //
  fetch("http://127.0.0.1:3000/task-submit", {
    method: 'POST',
    body: formData
  })
  .then((response) =>{
    console.log("Success send")    
    console.log(response);
    //return response.json();
  } )
  
  .then((task) => {
    console.log(task)
    setTaskInfo(task[0])
    return task;
  })

  .catch((err) => {
    console.log(err)
  });
 /*
   //let blob = new Blob([inputFile], {type: inputFile.type});
  //let blob_text = new Blob(["test"], {type: 'text/plain'});
  console.log(new Blob([inputFile], { type: inputFile.type }))
  let promise = new Blob([inputFile], { type: inputFile.type }).text();
  console.log(promise)
  promise.then((result)=>{
    console.log(result)
    console.log(typeof result)
    //new_task.pdf =  file_bolb;
    new_task.pdf = result;
    new_task.submittedDate=new Date().toJSON();
    console.log(new_task)
    
    fetch("http://127.0.0.1:3000/task-submit", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(new_task) 
    })
    .then((response) =>{
      console.log("Success send")    
      console.log(response);
      //return response.json();
    } )
    /*
    .then((task) => {
      console.log(task)
      setTaskInfo(task[0])
      return task;
    })
  
    .catch((err) => {
      console.log(err)
    });

  })
*/

})


//-------------------------------------------------------------------------------------
/*
 * ボタンの設定
 * アップロードされたファイル名の表示
*/
//ボタンへのクリックをinput[type="file"]へ送る。
btn_file.addEventListener('click',()=>{
  task_file.click();
})
let file_bolb;
task_file.addEventListener('change',e=>{

  const files = e.target.files;
  let htmlText = "";
  if(files.length===0) return;
  for(let i = 0 ; i < files.length ; i++){
    console.log(files[i].name);
    htmlText += files[i].name + "<br>" ;
  }
  console.log(htmlText)
  preview_file.innerHTML = htmlText;

    let file = e.target.files[0];
    let reader = new FileReader();
    //reader.readAsText(file);
    
    reader.readAsDataURL(file)

    reader.onload = function() {
      file_bolb = reader.result;
      console.log(typeof reader.result);
    };
    reader.onerror = function() {
      console.log(reader.error);
    };
  
});


/*

let submitted_task = {
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