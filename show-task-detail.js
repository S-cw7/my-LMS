const task_text = document.getElementById('task-text');
const resubmitBtn = document.getElementById('resubmitBtn');
const deleteBtn = document.getElementById("deleteBtn");
const name_element = document.getElementById('name');
const deadline_element = document.getElementById('deadline');
const category_element = document.getElementById('category');
const errMsg = document.getElementById("errMsg")
let shown_task;
//-------------------------------------------------------------------------------------------------------------
/*
 *ページ読み込み時の動作
*/
document.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOM fully loaded and parsed");
});
window.onpageshow = function(event) {
  if (event.persisted)  window.location.reload();
    //window.location.reload();
    
  };

//-------------------------------------------------------------------------------------------------------------
/*
 * 「再提出」ボタンを押したときに、submit-task.htmlに遷移する前に、
 * localStrageにselected_taskを保存する
*/
/*


//-------------------------------------------------------------------------------------------------------------
//以下は、submit-task.jsと全く同じ
let new_task;
/*
 * 「課題の削除」ボタンの入力で、登録された課題を削除する
*/
deleteBtn.addEventListener('click', (event)=>{
  //event.preventDefault();
  fetch("http://127.0.0.1:3000/delete-task", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(new_task) 
  })
  .then((response) =>{
    console.log("Success send")    
    console.log(response);
    window.location.href = 'index.html';
    //return response.json();
  } )
  .catch((err) => {
    //window.location.href = 'index.html';
    errMsg.innerHTML="エラー：課題を正しく読み込めませんでした"
    console.log(err)
  });
})
//-------------------------------------------------------------------------------------------------------------

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
    //@subimit-task.jsから追加した点
    if(task[0].text.length > 0) task_text.value=task[0].text;
    return task;
  })
  .catch((err) => {
    //window.location.href = 'index.html';
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