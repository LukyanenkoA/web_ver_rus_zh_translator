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

    //ocr js
    let canvas = document.getElementById("drawkanji-canvas");
    let context = canvas.getContext('2d', { willReadFrequently: true });
    canvas.addEventListener("mouseup", function(e) {
    draw_bool = false;
    e.preventDefault();
    var image = context.getImageData(0, 0, 1000, 1000);
    runOCR(image);
    });
    function runOCR(image_data) {
    let response = OCRAD(image_data);

    if ('innerText' in document.getElementById("kanji_info")) {
        document.getElementById("kanji_info").innerText = response;
    } else {
        document.getElementById("kanji_info").textContent = response;
    }

    }
  
});

