
function translate(){
    let info = document.getElementById('input').value;
    console.log(info);
    document.getElementById('output').value = info;
}
window.addEventListener("DOMContentLoaded", function (event) {
    console.log("DOM fully loaded and parsed");
    let b = document.getElementById('btnTranslate');
    b.addEventListener("click", translate);
  });