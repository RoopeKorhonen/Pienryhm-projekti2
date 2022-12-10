'use strict';
console.log("Program starts")
async function ask_name_difficulty() {
    let name = prompt("Give player name")
    let difficulty = prompt("Give Difficulty: Easy/Medium/Hard")
    try {
        const response = await fetch('http://127.0.0.1:5000/player_info/' + name + '/' + difficulty + '');
        const data = await response.json();
        console.log("Data inffo",data)
        append(data)
        return data;
    } catch (error) {
        console.log('Verkkovirhe: ', error)
    }
}
let code = ask_name_difficulty()