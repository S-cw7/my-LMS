
/*
 * httpsリクエスト
*/
let task;
console.log(fetch("http://localhost:3000/task"))
fetch("http://localhost:3000/task")
  .then((response) =>{
    console.log("Success fetch")
    console.log(response);
    //console.log(response.json());
    //console.log(response.text());
    //console.log(JSON.stringify(response));
    return response.json();
  },
  (e) => {
    console.log("error : response")
  } )
  .then((task) =>{
    console.log(task)
  },
  (e) => {
    console.log("error : json")
    console.log(e)
  } )

  //.catch((err) => console.log(err));