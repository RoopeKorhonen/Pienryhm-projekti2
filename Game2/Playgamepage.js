console.log("Program starts")
async function player_info(){
    let name = prompt("Give player name")
    let difficulty = prompt("Give difficulty level Easy/Medium/Hard")
    console.log("Name and difficulty", name, difficulty)
    try {
        const response = await fetch('http://127.0.0.1:5000/player_info/' + name +'/' + difficulty + '');
        const data = await response.json();
        console.log("Data info",data)
        append_info(data)
        return data;
    } catch (error) {
        console.log('Verkkovirhe: ', error)
    }
}
function append_info(datax){
    console.log("Appendi sisällä",datax)
    let list = document.getElementById('player_info');
    for(let i = 0; i < 1; i++){
        let player = document.createElement("tr")
        let player_username = document.createElement("td")
        let player_points = document.createElement("td")
        let player_difficulty = document.createElement("td")
        let player_budjet = document.createElement("td")
        player_username.innerText = datax['name']
        player_points.innerText = datax['points']
        player_difficulty.innerText = datax['difficulty']
        player_budjet.innerText = datax['co2_budjet']
        player.appendChild(player_username)
        player.appendChild(player_budjet)
        player.appendChild(player_points)
        player.appendChild(player_difficulty)
        list.appendChild(player)
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
    if (Math.random() < 1 / 3) {
        const modal = document.getElementById("myModal")
        modal.style.display = "block"
        let right_answer = ''
        let wrong_answer = ''
        const button1 = document.getElementById('button1');
        const button2 = document.getElementById('button2');
        let correct = ''
        let header = document.querySelector('h1');
        let question_text = question["question"];
        right_answer = question["right_answer"];
        wrong_answer = question["wrong_answer"];
        correct = right_answer
        header.innerHTML = question_text

        let time = 5;
        let timerElement = document.getElementById("timer");
        timerElement.innerHTML = "Time remaining: 5 seconds";
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
        console.log(question_text)
        button1.addEventListener('click', function () {
            let answer = button1.innerText;
            clearInterval(timer);

            if (answer === correct) {
                // lisää 100 co2 budjettiin

                console.log("OIKEIN!!!!!!!!!!!!!!")
                modal.style.display = "none"
            } else {
                console.log("VÄÄRIN!!!!!!!!!!!!!!!!!!!!!!")
                modal.style.display = "none"
            }

        })

        button2.addEventListener('click', function () {
            let answer = button2.innerText;
            clearInterval(timer);

            if (answer === correct) {
                // lisää 100 co2 budjettiin

                console.log("OIKEIN!!!!!!!!!!!!!!")
                modal.style.display = "none"
            } else {
                console.log("VÄÄRIN!!!!!!!!!!!!!!!!!!!!!!")
                modal.style.display = "none"
            }

        })

        function timeIsUp() {
            alert("Time is up, penalty has been added to your co2 fuel.")
            //tähän -200 co2 komento, joka päivittää tiedot.
            modal.style.display = "none"
        }

        return question_text


    }

}

let codes = player_info()

target = document.getElementById('lol')

const map = L.map('map')

    const options = {
      enableHighAccuracy: true,
      timeout: 9000,
      maximumAge: 0,
    };

    function success(pos) {
      const crd = pos.coords;

      // Use the leaflet.js library to show the location on the map (https://leafletjs.com/)
      map.setView([crd.latitude, crd.longitude], 1);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);
    }

    // Function to be called if an error occurs while retrieving location information
    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    // Starts the location search
    navigator.geolocation.getCurrentPosition(success, error, options);

    let marker = ''
    let airport_list = {airports:[]}
    const airports = L.featureGroup().addTo(map);

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
                current_airport = {name: name, ident: icao, latitude_deg: lat,
                longitude_deg: long, active: active}
                console.log('active airport found ' + name)
            }

            airport_list.airports.push({name: name, ident: icao, municipality: municipality, latitude_deg: lat,
                longitude_deg: long, active: active})
        }
        generateAirports()
        return data
        } catch (error){
            console.log('Verkkovirhe: ', error)
        }
    }

    /* Store the ICAO code of the airport the player is currently at,
    this will determine which airport will be marked as "active" after the refresh*/
    let current_airport

    async function generateAirports(){
        console.log(airport_list)
        airports.clearLayers();
        for (let airport of airport_list.airports){
            const marker = L.marker([airport.latitude_deg, airport.longitude_deg]).addTo(airports)
            if (airport.ident === current_airport) {
                airport.active = true;
                marker.bindPopup('You are here ' + airport.name);
                marker.openPopup();
                console.log('current airport is ' + airport.name);
            } else{
                const popupContent = document.createElement('div');
                const goButton = document.createElement('button');
                const distText = document.createElement('p');
                const h2text = document.createElement('h2');
                h2text.innerText = airport.name;
                goButton.innerText = 'Fly here';
                let textfordist = await fetch('http://127.0.0.1:5000/distanceLol/' + airport.latitude_deg + '/' + airport.longitude_deg + '/' + current_airport.latitude_deg + '/' + current_airport.longitude_deg)
                textfordist = await textfordist.json()
                distText.innerText = textfordist.Distance + ' km';
                goButton.classList.add('button');
                popupContent.append(distText)
                popupContent.append(goButton);
                popupContent.append(h2text);

                goButton.addEventListener('click', function () {
                    get_event()
                    current_airport = airport
                    console.log(current_airport)
                    generateAirports();
                });

                marker.bindPopup(popupContent);
            }
        }
    }

    getAirports()

