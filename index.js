let task_list_node = document.getElementById('task-list');
let task_item_list = document.querySelectorAll('.task-item');
let task_list;
//console.log(task_item_list)

/*
 * ページ読み込み時の動作
*/
window.onpageshow = function(event) {
//	if (event.persisted)  window.location.reload();
  //window.location.reload();
  loadTaskList()
	
};

/*
 * httpsリクエスト
*/
document.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOM fully loaded and parsed");
  loadTaskList()
});

function loadTaskList(){
  fetch("http://localhost:3000/task")
  .then((response) =>{
    console.log("Success fetch")
    console.log(response);
    return response.json();
  } )
  .then((list) => {
    console.log(list)
    for (let i = 0; i < list.length; i++) {
      console.log(list[i])
      //task-itemのaタグに、クリック時の動作を登録
      let taskItemNode = createTaskItemNode(list[i])
      let a_node = taskItemNode.querySelector('.task-item')
      console.log("a-tag : ")
      console.log(a_node)
      a_node.addEventListener('click', ()=>{
        storeSelctedTaskToLocalStrage(a_node)
      });
      //task_list_nodeへの追加
      task_list_node.appendChild(taskItemNode);
      //console.log(taskItemNode)
    }
    task_list = list;
    return list;
  })
  
  .catch((err) => console.log(err));
}
/*
 * 指定されたタグのノードを作成する。
 * kind       : タグ
 * className  : クラス名
 * text       : テキスト
 * 
*/
function createNode(kind, className, text, id=null, link=null){
  let node = document.createElement(kind);
  let attrnode;
  //null or 空文字の場合
  if(className){
    attrnode= document.createAttribute('class');
    attrnode.value = className;
    node.setAttributeNode(attrnode);
  }
  if(id){
    let attrnode = document.createAttribute('id');
    attrnode.value = id;
    node.setAttributeNode(attrnode);
  }
  if(link){
    // href属性の追加
    node.setAttribute("href", link);
  }
  if(text){
    node.textContent = text;
  }
  return node
}
/*
 * taskオブジェクトを元に、task-itemのノードを作成する関数。
 * task = {
 *   id: 4,
 *   submittedFlag : true,
 *   name: '期末試験',
 *   deadLine : null,
 *   submittedDate: submittedDate,
 *   pdf: null,
 *   text: '完了'
 * }
*/
function createTaskItemNode(task){
  li_node = createNode('li', null, null)
  a_node = createNode('a', 'task-item', null, id=task.id, link=task.submittedFlag? "show-task-detail.html":'submit-task.html')
  li_node.appendChild(a_node)
  //未提出かつ、期限切れ(締め切り < 現在時刻)
  a_node.appendChild(createNode('div',
    (!task['submittedFlag'] && isExpired
    (task['deadline']))? 'expired':'in-date',
    task['submittedFlag']? '提出済み':'未提出'))
  a_node.appendChild(createNode('div', 'name', task['name']));
  a_node.appendChild(createNode('div', null, '期限-'+changeDateFromStr(task['deadline'])))
  //console.log(li_node)
  return li_node;
}
function isExpired(deadline) {
  let deadline_date_list = StringBreakIntoDateList(deadline).slice(1,6);
  //javascriptの月は0から始まるので-1に注意
  let deadline_date =new Date(deadline_date_list[0], Number(deadline_date_list[1])-1, deadline_date_list[2], deadline_date_list[3], deadline_date_list[4]);
  let current_date = new Date();
  return (deadline_date < current_date)
}
/*
 * task.deadlineはstr型とする. ただし形は1991-02-04T13:15:18.000Z
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

function StringBreakIntoDateList(string){
  let date_list = []
  const regrex =  /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).(\d{3})Z/;
  if(regrex.test(string)){
    date_list = string.match(regrex); 
  }
  return date_list;
}

/*
 * タスクがクリックされた時の動作を登録する
 * (既存のtask-item)
*/
task_item_list.forEach(task_item => {
  task_item.addEventListener('click', (event)=>{
    event.preventDefault()
    storeSelctedTaskToLocalStrage(task_item)
    if(task_item.submittedFlag){
      //提出済みの場合
      window.location.href = 'submit-task.html';
    }else{
      //未提出の場合
      window.location.href = 'show-task-detail.html';
    }
  })
});
/*
 * タスクがクリックされた時の動作を登録する
*/
function storeSelctedTaskToLocalStrage(task_item_element){
  let name_node = task_item_element.getElementsByClassName('name').item(0)
  let selected_task ={
    id : task_item_element.id,
  }
  setJsonLocalStrage('selected_task', selected_task)
  //console.log("task-item"+task_item_element)
  //console.log(name_node.textContent)
  //console.log(localStorage)
}
function setJsonLocalStrage(key, json){
  let jsonString = JSON.stringify(json);
  localStorage.setItem(key, jsonString);
}
