let task_list_node = document.getElementById('task-list');
//2021-09-17T06:21:00.101Z
/*
var deadLine  = new Date('1991-02-04:22:15:18')
var submittedDate  = new Date('2002-02-04:22:15:18')
task = {
  id: 4,
  submittedFlag : true,
  name: '期末試験',
  deadLine : null,
  submittedDate: submittedDate,
  pdf: null,
  text: '完了'
}
task['deadline'] = deadLine
*/

/*
 * httpsリクエスト
*/
let task;
fetch("http://localhost:3000/task")
  .then((response) =>{
    console.log("Success fetch")
    console.log(response);
    console.log(response.body);
    console.log(JSON.stringify(response));
    return response;
  } )

  .catch((err) => console.log(err));

fetch("http://localhost:3000/task")
  .then((response) =>{
    console.log("Success fetch")
    console.log(response);
    return response.json();
  } )
  .then((task_list) => {
    console.log(task)
    for (let i = 0; i < task_list.length; i++) {
      console.log(task_list[i])
      task_list_node.appendChild(createTaskItemNode(task_list[i]));
    }
    return task_list;
  })
  
  .catch((err) => console.log(err));

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
  a_node = createNode('a', 'task-item', null)
  li_node.appendChild(a_node)
  //未提出かつ、期限切れ(締め切り < 現在時刻)
  a_node.appendChild(createNode('div',
    (!task['submittedFlag'] && isExpired
    (task['deadline']))? 'expired':'in-date',
    task['submittedFlag']? '提出済み':'未提出'))
  a_node.appendChild(createNode('div', null, task['name']));
  a_node.appendChild(createNode('div', null, '期限-'+changeDateFromStr(task['deadline'])))
  console.log(li_node)
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
 * 指定されたタグのノードを作成する。
 * kind       : タグ
 * className  : クラス名
 * text       : テキスト
 * 
*/
function createNode(kind, className, text){
  let node = document.createElement(kind);
  let attrnode;
  //null or 空文字の場合
  if(className){
    attrnode= document.createAttribute('class');
    attrnode.value = className;
    node.setAttributeNode(attrnode);
  }
  if(text){
    node.textContent = text;
  }
  return node
}

/*
 * task.deadlineはstr型とする. ただし形は1991-02-04T13:15:18.000Z
*/
function changeDateFromStr(deadline){
  let  formatted_deadline = "";
  let date_list = StringBreakIntoDateList(deadline)
  console.log(date_list)
  if(date_list.length > 0){
    formatted_deadline = date_list[1]
      + '/' +  date_list[2]
      + '/' +  date_list[3]
      + ' ' +  date_list[4]
      + ':' +  date_list[5]
    console.log(date_list);
  }
  console.log(deadline)
  
  console.log("formatted_deadline : "+formatted_deadline);
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