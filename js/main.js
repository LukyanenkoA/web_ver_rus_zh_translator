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
    /*const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
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
                        <h3>${data.meanings[0].partOfSpeech}</h3>
                        <h3>/${data.phonetic}/</h3>
                    </div>
                    <h3 class="word-meaning">
                    ${data.meanings[0].definitions[0].definition}
                    </h3>
                    <h3 class="word-example">
                        ${data.meanings[0].definitions[0].example || ""}
                    </h3>`;
            })
            .catch(() => {
                result.innerHTML = `<h3 class="error">Couldn't Find The Word</h3>`;
            });
    });*/
    //NOT working code :(
    /*function senddata() {
        $.ajax({
            url: "http://127.0.0.1:8000/api/words",
            type: "POST",
            data: {
                pinyin: "hǎo",
                simplified: "好",
                english: "good",
                traditional: "好",
                hsk: 1
            },
            dataType: "json",
            success: function(data){
                $("#content").html(data);
                console.log("SUCCESS: " + JSON.stringify(data));
            },
            error: function(data){
                $("#content").html("Failed to load data. " + JSON.stringify(data));
                console.log("ERROR: " + JSON.stringify(data));
            },
            complete: function(data){
                console.log("COMPLETED: " + JSON.stringify(data));
            },
        });
    }
    b.addEventListener("click", senddata());*/
    //working code when the backend and frontend are running on the same computer
    /*const url = "http://localhost:8000/api/words/";
    const url = "http://localhost:8000/api/words/";
    const result = document.getElementById("result");
    b.addEventListener("click", () => {
        let inpWord = document.getElementById("text-input").value;
        fetch(`${url}${inpWord}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                result.innerHTML = `
                    <div class="word">
                        <h3>упрощенный иероглиф: ${inpWord}</h3>
                    </div>
                    <div class="details">
                        <h3>традиционный иероглиф: ${data.traditional}</h3>
                        <h3>пиньинь: ${data.pinyin}</h3>
                    </div>
                    <h3 class="word-translation"> перевод на английский: 
                    ${data.english}
                    </h3>
                    <h3 class="word-example"> уровень hsk:
                        ${data.hsk}
                    </h3>`;
            })
            .catch(() => {
                result.innerHTML = `<h3 class="error">Couldn't Find The Word</h3>`;
            });
    });*/
    const url = "http://45.153.70.53:8000/api/words/";
    const result = document.getElementById("output");
    b.addEventListener("click", () => {
        let inpWord = document.getElementById("text-input").value;
        fetch(`${url}${inpWord}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                result.value = 
                `упрощенный иероглиф: ${inpWord}\nтрадиционный иероглиф: ${data.traditional}\nпиньинь: ${data.pinyin}\nперевод на английский: ${data.english}\nуровень hsk: ${data.hsk}`;
            })
            .catch(() => {
                result.value = `Такого слова нет`;
            });
    });
});

