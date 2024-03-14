//"use strict";
let task_list_node = document.getElementById('task-list');
let task_item_list = document.querySelectorAll('.task-item');
let task_info_list = document.querySelectorAll('.task-info'); //チェックボックス以外をクリックしたときに、タスク詳細画面遷移する
let jumpBottomBtn = document.getElementById('jump-bottom'); 
let jumpTopBtn = document.getElementById('jump-top');
let checkbox_list; //チェックボックス以外をクリックしたときに、タスク詳細画面遷移する
let batchDeleBtn = document.getElementById('batchDeleBtn');
let checkboxArea= document.querySelectorAll('.div-checkbox')[0]
let dropMenu = document.querySelectorAll('.drop-menu')[0]
let task_list;
let category_set = new Set();
category_set.add('全て');
/*
 * ページの末尾へジャンプするボタンの処理
*/
jumpBottomBtn.addEventListener('click', ()=>{
  var element = document.documentElement;
  var bottom = element.scrollHeight - element.clientHeight;
  window.scroll(0, bottom);
})
/*
 * ページのトップへジャンプするボタンの処理
*/
jumpTopBtn.addEventListener('click', ()=>{
  window.scroll(0, 0);
})
/*
 * ページの末尾へジャンプするボタンの処理
*/
jumpBottomBtn.addEventListener('click', ()=>{
  var bottom = element.scrollHeight - element.clientHeight;
  window.scroll(0, bottom);
})
/*
 * 一括削除ボタンの処理
*/
batchDeleBtn.addEventListener('click', ()=>{
  //チェックされたタスクの取得
  let id;
  let delete_list =[];  //チェックされたタスクのidリスト
  checkbox_list = document.querySelectorAll('.checkbox');
  console.log("clicked batch delete button ")
  checkbox_list.forEach(checkbox=> {
    id = checkbox.parentNode.parentNode.id;
    if ( checkbox.checked === true ) {
      if(id == null) throw "id is null" //idが未設定の場合はエラーを表示
      delete_list.push(id)    
    }
  });
  console.log(delete_list)

  //サーバへの一括削除依頼
  fetch("http://127.0.0.1:3000/batch-delete-task", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(delete_list) 
  })
  .then((response) =>{
    console.log("Success send")    
    console.log(response);
    window.location.href = 'index.html';
    location.reload() 

    //return response.json();
  } )
  .catch((err) => {
    //window.location.href = 'index.html';
    errMsg.innerHTML="エラー：課題を正しく削除できませんでした"
    console.log(err)
  });
})
/*
 * チェックボックスのクリック判定の拡大
*/
checkbox_list
checkboxArea.addEventListener('click', ()=>{
  console.log(checkboxArea.getElementsByClassName('div-checkbox'))
  checkboxArea.firstChild.checked = !checkboxArea.firstChild.checked
  console.log(checkboxArea.firstChild.checked)
})
/*
 * ページ読み込み時の動作
*/
window.onpageshow = function(event) {
	if (event.persisted)  window.location.reload();
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
      //カテゴリの追加
      category_set.add(list[i].category)
      console.log(list[i])
      //task-itemのaタグに、クリック時の動作を登録
      addTaskItem(list[i])
    }
    task_list = list;
    //絞り込みメニューのitemの追加
    console.log(category_set)
    console.log(dropMenu.querySelectorAll('.drop-menu__item').length )
    //2度追加されるため
    if(dropMenu.querySelectorAll('.drop-menu__item').length <= 1){
      category_set.forEach(category => {
        addCategoryMenu(category);    
      });
    }


    return list;
  })
  
  .catch((err) => console.log(err));
}
function addTaskItem(task) {
  console.log((new Date( task.deadline)).toLocaleString('ja-JP', {
    timeZone: 'Asia/Tokyo',
  }))
  task.deadline =  (new Date( task.deadline)).toLocaleString('ja-JP', {
    timeZone: 'Asia/Tokyo',
  })
  let taskItemNode = createTaskItemNode(task)
  let a_node = taskItemNode.querySelector('.task-item')
  let task_info_node = taskItemNode.querySelector('.task-info')
  task_info_node.addEventListener('click', (event)=>{
    console.log('click task-info')
    //console.log(taskItemNode)
    //console.log(task.submittedFlag)
    storeSelctedTaskToLocalStrage(a_node)
    event.preventDefault()
    if(task.submittedFlag || task.submittedFlag==1){
      //提出済みの場合
      window.location.href = 'show-task-detail.html';
    }else{
      //未提出の場合
      window.location.href = 'submit-task.html';
    }
  });
  //チェックボックスの範囲を拡大する処理の追加
  let checkbox_node = a_node.getElementsByClassName('checkbox')[0]
  checkbox_node.parentNode.addEventListener('click', ()=>{
    console.log(checkbox_node.checked)
    checkbox_node.click()
  })
  checkbox_node.addEventListener("click", (e)=>{
    checkbox_node.click()
  })
  //task_list_nodeへの追加
  task_list_node.appendChild(taskItemNode);
  
}
function addCategoryMenu(category){
  //ノードの作成
  li_node = createNode({tag:'li', className:"drop-menu__item"})
  a_node = createNode({tag:'a', className:"drop-menu__link", text:category})
  li_node.appendChild(a_node)
  dropMenu.appendChild(li_node)
  console.log(li_node)
  //イベントの追加
  li_node.addEventListener('click', (event)=>{
    event.preventDefault()
    //task_list_nodeの初期化
    while( task_list_node.firstChild ){
      task_list_node.removeChild( task_list_node.firstChild );
    }
    //categoryのみのtaskItemの追加と表示
    for (let i = 0; i < task_list.length; i++) {
      if(category == '全て'){
          //task-itemのaタグに、クリック時の動作を登録
          addTaskItem(task_list[i])
      }else if(task_list[i].category == category){
          addTaskItem(task_list[i])
      }    
    }
    console.log("add : "+category)
  })
}
/*
 * 指定されたタグのノードを作成する。
 * kind       : タグ
 * className  : クラス名
 * text       : テキスト
 * 
*/
function createNode({tag, className=null, text=null, id=null, link=null, type=null, props_name=null, classNameList=[]}){
  if(tag == null) throw "createNode method need tag";
  let node = document.createElement(tag);
  let attrnode;
  //null or 空文字の場合
  if(className != null){
    attrnode= document.createAttribute('class');
    attrnode.value = className;
    node.setAttributeNode(attrnode);
  }
  if(classNameList.length > 0){
    
    classNameList.forEach(cn => {
      node.classList.add(cn);
    });
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
  if(type){
    node.setAttribute("type", type);
  }
  if(props_name !=null){
    node.setAttribute("name", props_name);
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
  let li_node = createNode({tag:'li'})
  let a_node = createNode({tag:'a', className:'task-item', id:task.id})
  
  let div_checkbox_node = createNode({tag:'div'});
  let input_checkbox_node = createNode({tag:'input', className:"checkbox", type:"checkbox", props_name:""});
  div_checkbox_node.appendChild(input_checkbox_node);
  let div_task_info_node = createNode({tag:'div', className:"task-info", link:(task.submittedFlag? "show-task-detail.html":'submit-task.html')});
  li_node.appendChild(a_node)
  a_node.appendChild(div_checkbox_node);
  a_node.appendChild(div_task_info_node);
  //未提出かつ、期限切れ(締め切り < 現在時刻)
  let note;
  //提出済み、未提出、遅延s
  div_task_info_node.appendChild(
    createNode({tag:'div',
      //className:(task['submittedFlag']==0 && isExpired(task['deadline']))? 'expired':'in-date',
      className:(task['submittedFlag']==0 && isExpired(task['deadline']))? 'expired':'in-date',
      text : task['submittedFlag']==1? '提出済み':'未提出', 
      classNameList:["submitted-status"]
  })
  )
  div_task_info_node.appendChild(createNode({
    tag:'div', 
    className:'name', 
    text:(task['name']+'\n ('+task['category']+')')}));
  //div_task_info_node.appendChild(createNode({tag:'div', text:'期限-'+changeDateFromStr(task['deadline'])}))
  div_task_info_node.appendChild(createNode({tag:'div', text:'期限-'+task['deadline'].slice(0, -3)}))
  console.log(li_node)
  return li_node;
}
function isExpired(deadline) {
  //let deadline_date_list = StringBreakIntoDateList(deadline).slice(1,6);
  //javascriptの月は0から始まるので-1に注意
  //let deadline_date =new Date(deadline_date_list[0], Number(deadline_date_list[1])-1, deadline_date_list[2], deadline_date_list[3], deadline_date_list[4]);
  let current_date = new Date();
  let deadline_date = new Date(deadline)
  //console.log(deadline_date.toISOString())
  //console.log(current_date.toISOString())
  //console.log(deadline_date < current_date)

  return (deadline_date < current_date)
}
/*
 * task.deadlineはstr型とする. ただし形は1991-02-04T13:15:18.000Z
*/
function changeDateFromStr(deadline){
  console.log(deadline)
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
task_info_list.forEach(task_item => {
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
  let selected_task ={
    id : task_item_element.id,
  }
  setJsonLocalStrage('selected_task', selected_task)
  //console.log("task-item"+task_item_element)
  //console.log(name_node.textContent)
  console.log(localStorage)
}
function setJsonLocalStrage(key, json){
  let jsonString = JSON.stringify(json);
  localStorage.setItem(key, jsonString);
}

//「絞り込み」メニュー自体をクリックしてもリロードされないようにする
document.querySelectorAll('.menu__item')[0].addEventListener('click', (event)=>{
  event.preventDefault()
})
  // DOM取得
  // 親メニューのli要素
  const parentMenuItem = document.querySelectorAll('.menu__item');
  console.log(parentMenuItem);

  // イベントを付加
  for (let i = 0; i < parentMenuItem.length; i++) {

    parentMenuItem[i].addEventListener('mouseover', dropDownMenuOpen);
    parentMenuItem[i].addEventListener('mouseleave', dropDownMenuClose);
  }

  // ドロップダウンメニューを開く処理
  function dropDownMenuOpen(e) {
    // 子メニューa要素
    const childMenuLink = e.currentTarget.querySelectorAll('.drop-menu__link');
    console.log(childMenuLink);

    // is-activeを付加
    for (let i = 0; i < childMenuLink.length; i++) {
      childMenuLink[i].classList.add('is-active');
    }

  }

  // ドロップダウンメニューを閉じる処理
  function dropDownMenuClose(e) {
    // 子メニューリンク
    const childMenuLink = e.currentTarget.querySelectorAll('.drop-menu__link');
    console.log(childMenuLink);

    // is-activeを削除
    for (let i = 0; i < childMenuLink.length; i++) {
      childMenuLink[i].classList.remove('is-active');
    }
  }
