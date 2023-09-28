function translate(){
    if(document.getElementById('tab-btn-1').checked) {
        //text input radio button is checked
        let info = document.getElementById('text-input').value;
        document.getElementById('output').value = info;
      }else if(document.getElementById('tab-btn-2').checked) {
        //draw input radio button is checked
        let info = document.getElementById('drawkanji-canvas').value;
        document.getElementById('output').value = 'перевод нарисованного иероглифа';
      }
}
window.addEventListener("DOMContentLoaded", function (event) {
    console.log("DOM fully loaded and parsed");
    let b = document.getElementById('btnTranslate');
    b.addEventListener("click", translate);
});

