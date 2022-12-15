const diffModal = document.getElementById('info-modal')
diffModal.style.display = "block"
let name
const inputField = document.querySelector('input')
let difficulty

const easyBtn = document.getElementById('easy');
const mediumBtn = document.getElementById('medium');
const hardBtn = document.getElementById('hard');

easyBtn.addEventListener('click', function(){
    name = inputField.value

    if (name.length > 0) {
        difficulty = "Easy"
        player_info(name, difficulty)
        diffModal.style.display = "none"
    }
})
mediumBtn.addEventListener('click', function(){
    name = inputField.value

    if (name.length > 0) {
        difficulty = "Medium"
        player_info(name, difficulty)
        diffModal.style.display = "none"
    }
})
hardBtn.addEventListener('click', function(){
    name = inputField.value

    if (name.length > 0) {
        difficulty = "Hard"
        player_info(name, difficulty)
        diffModal.style.display = "none"
    }
})


async function player_info(name, difficulty){
    /* console.log('getting player info')
    const diffModal = document.getElementById('info-modal')
    diffModal.style.display = "block"
    let name = prompt("Give player name")
    let difficulty = prompt("Give difficulty level Easy/Medium/Hard")
    console.log("Name and difficulty", name, difficulty) */
    try {
        const response = await fetch('http://127.0.0.1:5000/player_info/' + name +'/' + difficulty + '');
        const data = await response.json();
        append_info(data)
        codes = data
        console.log('codes: ' + codes)
        getAirports()
    } catch (error) {
        console.log('Verkkovirhe: ', error)
    }
}
let player = document.createElement("tr");
let player_username = document.createElement("td");
let player_points = document.createElement("td");
let player_difficulty = document.createElement("td");
let player_budjet = document.createElement("td");

function append_info(datax){
    console.log("Appendi sisällä",datax)
    let list = document.getElementById('player_info');
    for(let i = 0; i < 1; i++){
        player_username.innerText = datax['name']
        let player_points_name = datax['points']
        let player_co2_budget_name = datax['co2_budjet']
        let player_name = datax['name']
        let player_difficulty_name = datax['difficulty']
        player_points.innerText = datax['points']
        player_difficulty.innerText = datax['difficulty']
        player_budjet.innerText = datax['co2_budjet']
        player.appendChild(player_username)
        player.appendChild(player_budjet)
        player.appendChild(player_points)
        player.appendChild(player_difficulty)
        list.appendChild(player)
        console.log("Playerin budgetti", player_co2_budget_name)
    }
}


async function get_event() {
    try {
        const response = await fetch('http://127.0.0.1:5000/get_question/');
        const data = await response.json();
        console.log("Event data inffo",data)
        play_event(data)
        return data;
    } catch (error) {
        console.log('Verkkovirhe: ', error)
    }
}



function play_event(question) {
    console.log(question)
    if (Math.random() < 2 / 3) {
        const modal = document.getElementById("myModal");
        const modalBG = document.getElementById("modal-background");
        const resultModal = document.getElementById("result");
        const button1 = document.getElementById("button1");
        const button2 = document.getElementById('button2');
        const header = document.getElementById('question');
        const question_text = question["question"];
        const right_answer = question["right_answer"];
        const wrong_answer = question["wrong_answer"];
        let correct = right_answer
        modal.style.display = "block"
        modalBG.style.display = "block";
        header.innerHTML = question_text

        let timeAvailable
        if (difficulty === "Easy") {
            timeAvailable = 15;
        } else if (difficulty === "Medium"){
            timeAvailable = 10;
        }
        else{
            timeAvailable = 5;
        }

        let time = timeAvailable;
        let timerElement = document.getElementById("timer");
        timerElement.innerHTML = "Time remaining: " + time + " seconds";
        //document.body.appendChild(timerElement);
        let timer = setInterval(function () {
            time = time - 1;
            timerElement.innerHTML = "Time remaining: " + time + " seconds";
            if (time === -1) {
                alert("Time is up, penalty has been added to your co2 fuel.")
                //tähän -200 co2 komento, joka päivittää tiedot.
                modal.style.display = "none"
                clearInterval(timer);
            }
        }, 1000);


        let button_rand = Math.floor(Math.random() * 2)
        if (button_rand === 1) {
            button1.innerText = right_answer
            button2.innerText = wrong_answer
        } else {
            button1.innerText = wrong_answer
            button2.innerText = right_answer
        }

        button1.addEventListener('click', function getAnswer() {
            button1.replaceWith(button1.cloneNode(true))
            button2.replaceWith(button2.cloneNode(true))
            modal.style.display = "none";
            modalBG.style.display = "none";
            clearInterval(timer);
            console.log('button 1 pressed')
            let answer = button1.innerText;

            if (answer === correct
            ) {
                codes.co2_budjet += Math.round((parseInt(dist) / 100 * 20))
                player_budjet.innerText = codes.co2_budjet
                console.log("OIKEIN!!!!!!!!!!!!!!")
                resultModal.style.display = "block";
                resultModal.innerText = 'CORRECT!'
            } else {
                console.log("VÄÄRIN!!!!!!!!!!!!!!!!!!!!!!")
                resultModal.style.display = "block";
                resultModal.innerText = 'WRONG!'
                codes.co2_budjet -= Math.round((parseInt(dist) * 2))
                player_budjet.innerText = codes.co2_budjet
            }
            const message = setInterval(function() {
                resultModal.style.display = "none";
                button2.removeEventListener('click', getAnswer)
                if (codes.co2_budjet <= 0){
                game_over()
            }
                clearInterval(message);
            }, 2000)
            button1.removeEventListener('click', getAnswer)
        })


        button2.addEventListener('click', function getAnswer2() {
            button1.replaceWith(button1.cloneNode(true))
            button2.replaceWith(button2.cloneNode(true))
            modal.style.display = "none";
            modalBG.style.display = "none";
            button2.removeEventListener('click', getAnswer2)
            clearInterval(timer);
            console.log('button 2 pressed')
            let answer2 = button2.innerText;
            console.log(answer2)

            if (answer2 === correct) {
                codes.co2_budjet += Math.round((parseInt(dist) / 100 * 10))
                player_budjet.innerText = codes.co2_budjet
                console.log("OIKEIN!!!!!!!!!!!!!!")
                resultModal.style.display = "block";
                resultModal.innerText = 'CORRECT!'
            } else {
                console.log("VÄÄRIN!!!!!!!!!!!!!!!!!!!!!!")
                resultModal.style.display = "block";
                resultModal.innerText = 'WRONG!'
                codes.co2_budjet -= Math.round((parseInt(dist) * 2))
                player_budjet.innerText = codes.co2_budjet
            }
            const message = setInterval(function() {
                resultModal.style.display = "none";
                button2.removeEventListener('click', getAnswer2);
                if (codes.co2_budjet <= 0){
                game_over()}

                clearInterval(message);
            }, 2000)
        })

        function timeIsUp() {
            alert("Time is up, penalty has been added to your co2 fuel.")
            //tähän -200 co2 komento, joka päivittää tiedot.
            modal.style.display = "none"
        }

        return question_text
    } else{
         getWeather(current_airport.latitude_deg, current_airport.longitude_deg)
    }

}
// Semi toimiva funktio jotenki ei vaa saa yhteyttä suosittelen tätä käyttää pisteitte laskuu
async function calculate_co2_budget(player_budget, distance) {
    try {
        const response = await fetch('http://127.0.0.1:5000/calculate_co2_budget/' + player_budget['co2_budjet'] + '/' + distance);
        const data = await response.json()
        codes.co2_budjet = data.budget;
        player_budjet.innerText = codes.co2_budjet
        if (codes.co2_budjet <= 0){
            game_over()
        }
        /* let player_budget_open = await player_budget.then(function(result) {
            console.log("promise auki juttu", result)
            return result
})
        console.log("Playerbudget auki", player_budget_open)
        console.log("Playerin budgetti ennen laskentaa",player_budget)
        const response = await fetch('http://127.0.0.1:5000/calculate_co2_budget/' + player_budget_open['co2_budjet']);
        const data = await response.json();
        console.log("Laskettu budget info",data)
        return data; */
    } catch (error) {
        console.log('Verkkovirhe: ', error)
    }
}

async function game_over(){
   try {
        const response = await fetch('http://127.0.0.1:5000/game_over/' + codes["name"] + '/' + codes["points"] + '/' + codes["difficulty"]);
        const data = await response.json();
        console.log("Event data inffo",data)
        play_event(data)
        return data;
    } catch (error) {
        console.log('Verkkovirhe: ', error)
    }
    location.replace("./Fullhighscorespage.html")
}


let codes
console.log(codes)
target = document.getElementById('the-map')


const map = L.map('map')

    const options = {
      enableHighAccuracy: true,
      timeout: 9000,
      maximumAge: 0,
    };

    function success(pos) {
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 20
      }).addTo(map);
    }

    // Function to be called if an error occurs while retrieving location information
    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }
    // Starts the location search
    navigator.geolocation.getCurrentPosition(success, error, options);


    let dist
    let airport_list = {airports:[]}
    const airports = L.featureGroup().addTo(map);

    const blueIcon = L.divIcon({className: 'blue-icon'})
    const redIcon = L.divIcon({className: 'red-icon'})


    /*Get the weather at the airport the player is at*/
    async function getWeather(lat, long){
        try{
            const response = await fetch('http://127.0.0.1:5000/get_weather/' + lat + '/' + long)
            const data = await response.json();
            console.log(data["description"])
            let alertModal = document.getElementById('info-modal')

            if (data["description"].includes("thunderstorm")){
                codes.co2_budjet -= 10000
                player_budjet.innerText = codes.co2_budjet
                alertModal.style.display = "block";
                alertModal.innerText = "Oh no! You flew into a thunder storm and had to take multiple longer routes to avoid getting hit! This will be disastrous for your Co2 consumption!"

                const alert = setInterval(function() {
                    alertModal.style.display = "none";
                    if (codes.co2_budjet <= 0){
                    game_over()
            }
                clearInterval(alert);
            }, 3000)
            }

            if (data["description"].includes("rain")){
                player_budjet.innerText = codes.co2_budjet
                if (data["description"].includes("shower rain")){
                    console.log("OH NO SHOWER RAIN TIME!")
                    alertModal.style.display = "block";
                    alertModal.innerText = "Oh no you've been struck by heavy rain on your trip!"
                    codes.co2_budjet -= 2000
                }
                const alert = setInterval(function() {
                    alertModal.style.display = "none";
                    if (codes.co2_budjet <= 0){
                    game_over()}
                clearInterval(alert);
            }, 3000)
            }

            if (data["description"].includes("clear sky")){
                alertModal.style.display = "block";
                alertModal.innerText = "the pleasant clear skies made your trip much smoother, you used less Co2."
                codes.co2_budjet += 3000
                const alert = setInterval(function() {
                    alertModal.style.display = "none";
                    if (codes.co2_budjet <= 0){
                    game_over()}
                clearInterval(alert);
            }, 3000)
            }

            if (data["description"].includes("mist")){
                alertModal.style.display = "block";
                alertModal.innerText = "This mist makes it very hard to see"
                const alert = setInterval(function() {
                    alertModal.style.display = "none";
                    if (codes.co2_budjet <= 0){
                    game_over()}
                clearInterval(alert);
            }, 3000)
            }
        } catch (error){
            console.log(error)
        }
    }


    async function getAirports(){
        try{
        const response = await fetch('http://127.0.0.1:5000/airport/self');
        const data = await response.json();

        for (let i = 0; i !== data.latitude_deg.length; i++){

            let icao = data.ident[i];
            let name = data.name[i];
            let municipality = data.municipality[i]
            let active = false
            let lat = data.latitude_deg[i];
            let long = data.longitude_deg[i];
            //console.log(name, lat, long)

            if (i === 99){
                active = true
                current_airport = {name: name, ident: icao, latitude_deg: lat,
                longitude_deg: long, active: active}
                console.log('active airport found ' + name)
                console.log(current_airport)
                map.setView([current_airport.latitude_deg, current_airport.longitude_deg], 3);
            }

            airport_list.airports.push({name: name, ident: icao, municipality: municipality, latitude_deg: lat,
                longitude_deg: long, active: active})
        }
        generateAirports()
        } catch (error){
            console.log('Verkkovirhe: ', error)
        }
    }


    /* Store the ICAO code of the airport the player is currently at,
    this will determine which airport will be marked as "active" after the refresh*/
    let current_airport

    /*Take the airports from the JSON generated at the start of the game and put them on the map*/
    async function generateAirports(){
        console.log(airport_list)
        airports.clearLayers();

        for (let airport of airport_list.airports){
            const marker = L.marker([airport.latitude_deg, airport.longitude_deg]).addTo(airports)
            if (airport.active) {
                marker.setIcon(redIcon)
                marker.bindPopup('You are here ' + airport.name);
                marker.openPopup();
                airport.active = false
                console.log('current airport is ' + airport.name);

            } else{
                marker.setIcon(blueIcon)
                const popupContent = document.createElement('div');
                const goButton = document.createElement('button');
                const distText = document.createElement('p');
                const h2text = document.createElement('h2');

                goButton.id = "go-button"
                h2text.innerText = airport.name;
                goButton.innerText = 'Fly here';
                goButton.classList.add('button');

                let textfordist = await fetch('http://127.0.0.1:5000/distance_calculation/' + airport.latitude_deg + '/' + airport.longitude_deg + '/' + current_airport.latitude_deg + '/' + current_airport.longitude_deg)
                textfordist = await textfordist.json()
                distText.innerText = textfordist.Distance + ' km';

                popupContent.append(distText)
                popupContent.append(goButton);
                popupContent.append(h2text);

                goButton.addEventListener('click', function () {
                    //Tässä kutsutaa tota alempaa funktioo nii laskisi uudet pisteet ei toimi saa yrittää korjata
                    current_airport = airport
                    current_airport.active = true

                    dist = parseInt(textfordist.Distance)
                    codes.points += 1000
                    player_points.innerText = codes.points

                    calculate_co2_budget(codes, parseInt(dist))
                    generateAirports();
                    get_event()
                });

                marker.bindPopup(popupContent);
            }
        }
        console.log(codes)
    }
