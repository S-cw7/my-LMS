

const category = document.getElementById("category-name");
const task_name = document.getElementById("task-name");
const deadline_date = document.getElementById("task-deadline-date");
const deadline_time = document.getElementById("task-deadline-time");
const submitBtn= document.getElementById("submit-button");
let getted_task;
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
  //return  response.arrayBuffer();
})
.then(task => {
  console.log(task)
  getted_task = task[0]
  setTaskOriginalInfo(task[0])
})
  
//---------------------------------------------------------------------------
/*
 * 与えられたjson形式のタスクから、タスク情報をセットして表示する
*/
function setTaskOriginalInfo(task) {
  let deadline_list = changeDateFromStr(task.deadline)
  console.log(deadline_list)
  category.value = task.category
  task_name.value = task.name
  console.log(deadline_list[0])
  deadline_date.value = deadline_list[0]
  deadline_time.value = deadline_list[1] 
}
submitBtn.addEventListener('click', (event)=>{
  event.preventDefault();
  task = {
    id:getted_task.id,
    name: task_name.value,
    category: category.value,
    deadline :  deadline_date.value+" "+deadline_time.value, 
  }
  console.log(task);

  fetch("http://127.0.0.1:3000/update-task", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(task) 
  })
  .then((response) =>{
    window.location.href = 'index.html';
    console.log("Success fetch")    
    console.log(response);
    
  } )
  .catch((err) => {
    console.log(task)
    errMsg.innerHTML="エラー：課題内容が変更できませんでした"
    console.log(err)
  });
})
//---------------------------------------------------------------------------


/*
 * show-task-detail.jsと同じ
 * localStrageからjsonのデータを取得する
*/
function getJsonLocalStrage(key) {
  let json = JSON.parse(localStorage.getItem(key));
  console.log(json); // true
  console.log(localStorage)
  return json;
}
/*
 * index.jsと同じ 
*/
/*
 * task.deadlineはstr型とする. ただし形は1991-02-04T13:15:18.000Z
*/
function changeDateFromStr(deadline, sep="/"){
  let  formatted_date = "";
  let  formatted_time = "";
  let date_list = StringBreakIntoDateList(deadline, sep="-")
  //console.log(date_list)
  if(date_list.length > 0){
    formatted_date = date_list[1]+ sep +  date_list[2] + sep +  date_list[3];
    formatted_time =  date_list[4] + ':' +  date_list[5]
    console.log(date_list);
  }
  //console.log(deadline)
  
  //console.log("formatted_deadline : "+formatted_deadline);
  return [formatted_date, formatted_time];
}

function StringBreakIntoDateList(string){
  let date_list = []
  const regrex =  /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).(\d{3})Z/;
  if(regrex.test(string)){
    date_list = string.match(regrex); 
  }
  return date_list;
}
