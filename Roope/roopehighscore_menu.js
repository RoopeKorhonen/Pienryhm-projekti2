'use strict';
console.log("Program starts")
async function highscore() {
    try {
        const response = await fetch('http://127.0.0.1:5000/get_highscore/');
        const data = await response.json();
        console.log('result', data);
        //renderResult(data);
        return data;
    } catch (error) {
        console.log('Verkkovirhe: ', error)
    }
}
const hs_button = document.querySelector('button');
hs_button.addEventListener('click', async function(event){
    // estää refresh <form>issa
    event.preventDefault()
    console.log('click event', event)
    let highscores_list = highscore()
    console.log('highscore list', highscores_list)
})
