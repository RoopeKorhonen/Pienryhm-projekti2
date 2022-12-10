'use strict';
console.log("Program starts")
async function player_info(){
    let name = prompt("Give player name")
    let difficulty = prompt("Give difficulty level Easy/Medium/Hard")
    console.log("Name and difficulty", name, difficulty)
    try {
        const response = await fetch('http://127.0.0.1:5000/player_info/' + name +'/' + difficulty + '');
        const data = await response.json();
        console.log("Data info",data)
        append(data)
        return data;
    } catch (error) {
        console.log('Verkkovirhe: ', error)
    }
}
let code=player_info()
