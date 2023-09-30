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
    const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
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
                        <p>${data[0].meanings[0].partOfSpeech}</p>
                        <p>/${data[0].phonetic}/</p>
                    </div>
                    <p class="word-meaning">
                    ${data[0].meanings[0].definitions[0].definition}
                    </p>
                    <p class="word-example">
                        ${data[0].meanings[0].definitions[0].example || ""}
                    </p>`;
            })
            .catch(() => {
                result.innerHTML = `<h3 class="error">Couldn't Find The Word</h3>`;
            });
    });
});

