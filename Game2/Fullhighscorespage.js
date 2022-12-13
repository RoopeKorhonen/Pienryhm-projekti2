'use strict';
console.log("Program starts")
async function highscore() {
    try {
        const response = await fetch('http://127.0.0.1:5000/get_full_highscores/');
        const data = await response.json();
        console.log("Data inffo",data)
        append(data)
        return data;
    } catch (error) {
        console.log('Verkkovirhe: ', error)
    }
}
function append(data){
    console.log(data)
    let list = document.getElementById('highscorefulllist');
    for(let i = 0; i < data.length; i++){
    let player = document.createElement("tr")
    let player_username = document.createElement("td")
    let player_points = document.createElement("td")
    let player_difficulty = document.createElement("td")
    player_username.innerText = data[i]['screen_name']
    player_points.innerText = data[i]['highscores']
    player_difficulty.innerText = data[i]['difficulty']
    player.appendChild(player_username)
    player.appendChild(player_points)
    player.appendChild(player_difficulty)
    list.appendChild(player)
    }
}
let code = highscore()

