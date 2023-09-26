//fetch('http://127.0.0.1:8000/')
  //      .then(res => res.json())
    //    .then(data => {console.log(data)})
function translate(){
    let info = document.getElementById('input').value;
    document.getElementById('output').value = info;
}
window.addEventListener("DOMContentLoaded", function (event) {
    console.log("DOM fully loaded and parsed");
    let b = document.getElementById('btnTranslate');
    b.addEventListener("click", translate);
  });
