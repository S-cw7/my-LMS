

const category = document.getElementById("category-name");
const task_name = document.getElementById("task-name");
const deadline_date = document.getElementById("task-deadline-date");
const deadline_time = document.getElementById("task-deadline-time");
const submitBtn= document.getElementById("submit-button");

submitBtn.addEventListener('click', (event)=>{
  event.preventDefault();
  console.log(deadline_date.value+" "+deadline_time.value)
  task = {
    submittedFlag : false,
    name: task_name.value,
    category: category.value,
    deadline :  deadline_date.value+" "+deadline_time.value, 
  }
  console.log(task);

  fetch("http://127.0.0.1:3000/register", {
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
    errMsg.innerHTML="エラー：課題が登録できませんでした"
    console.log(err)
  });
})
