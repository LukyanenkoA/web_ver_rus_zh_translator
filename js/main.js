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
    //b.addEventListener("click", translate);


    //working code if i need english monilingual dictionary
    const url = "http://127.0.0.1:8000/api/words/";
    const result = document.getElementById("result");
    b.addEventListener("click", () => {
        let inpWord = document.getElementById("text-input").value;
        fetch(`${url}${inpWord}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                result.innerHTML = `
                    <div class="word">
                        <h3>${inpWord}</h3>
                    </div>
                    <div class="details">
                        <p>традиционный иероглиф${data.traditional}</p>
                        <p>упрощенный иероглиф${data.simplified}</p>
                        <p>/${data.pinyin}/</p>
                    </div>
                    <p class="word-translation">
                    ${data.english}
                    </p>
                    <p class="word-hsk">
                        ${data.hsk}
                    </p>`;
            })
            //.catch(() => {
              //  result.innerHTML = `<h3 class="error">Couldn't Find The Word</h3>`;
            //});
    });
});

