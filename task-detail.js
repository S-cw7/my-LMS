const task_file = document.getElementById('input-file');
const btn_file = document.getElementById('btn-file');
const preview_file = document.getElementById('preview-file');
const task_text = document.getElementById('task-text');
const sndBtn= document.getElementById('submit-button');


//let selected_task = getJsonLocalStrage("selected_task")
let selected_task = {
  id:3,
  name:"test"
}
console.log(selected_task)
fetch("http://127.0.0.1:3000/task-detail", {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(selected_task) 
})
.then((response) =>{
  console.log("Success send")    
  console.log(response);
  return response.json();
} )
.then((list) => {
  console.log(list)
  return list;
})
.catch((err) => {
  console.log(err)
});

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

console.log(task_file, btn_file, preview_file)
/*
 * localStrageからjsonのデータを取得する
*/
function getJsonLocalStrage(key) {
  let json = JSON.parse(localStorage.getItem(key));
  console.log(json); // true
  console.log(localStorage)
  return json;
}
/*
 * 送信ボタンのクリック時の動作
*/
sndBtn.addEventListener('click', ()=>{
  console.log(task_file.files)
  console.log(task_text.value)

})


/*
 * ボタンの設定
 * アップロードされたファイル名の表示
*/
//ボタンへのクリックをinput[type="file"]へ送る。
btn_file.addEventListener('click',()=>{
  task_file.click();
})

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

});