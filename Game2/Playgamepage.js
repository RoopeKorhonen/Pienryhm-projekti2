async function player_info(){
    console.log('getting player info')
    let name = prompt("Give player name")
    let difficulty = prompt("Give difficulty level Easy/Medium/Hard")
    console.log("Name and difficulty", name, difficulty)
    try {
        const response = await fetch('http://127.0.0.1:5000/player_info/' + name +'/' + difficulty + '');
        const data = await response.json();
        append_info(data)
        codes = data
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
        const modal = document.getElementById("myModal")
        modal.style.display = "block"
        let right_answer = ''
        let wrong_answer = ''
        const button1 = document.getElementById('button1');
        const button2 = document.getElementById('button2');
        let correct = ''
        let header = document.getElementById('question');
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
// Semi toimiva funktio jotenki ei vaa saa yhteyttä suosittelen tätä käyttää pisteitte laskuu
async function calculate_co2_budget(player_budget) {
    try {
        const response = await fetch('http://127.0.0.1:5000/calculate_co2_budget/' + player_budget['co2_budjet']);
        const data = await response.json()
        codes.co2_budjet = data.budget;
        console.log(data)
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


let codes = player_info()
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


    let marker = ''
    let airport_list = {airports:[]}
    const airports = L.featureGroup().addTo(map);

    const blueIcon = L.divIcon({className: 'blue-icon'})
    const redIcon = L.divIcon({className: 'red-icon'})


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

                h2text.innerText = airport.name;
                goButton.innerText = 'Fly here';
                goButton.classList.add('button');

                let textfordist = await fetch('http://127.0.0.1:5000/distanceLol/' + airport.latitude_deg + '/' + airport.longitude_deg + '/' + current_airport.latitude_deg + '/' + current_airport.longitude_deg)
                textfordist = await textfordist.json()
                distText.innerText = textfordist.Distance + ' km';

                popupContent.append(distText)
                popupContent.append(goButton);
                popupContent.append(h2text);

                goButton.addEventListener('click', function () {
                    console.log(current_airport)
                    //Tässä kutsutaa tota alempaa funktioo nii laskisi uudet pisteet ei toimi saa yrittää korjata
                    current_airport = airport
                    current_airport.active = true
                    console.log(current_airport)
                    let new_budget = calculate_co2_budget(codes)
                    console.log(new_budget)
                    generateAirports();
                    get_event()
                });

                marker.bindPopup(popupContent);
            }
        }
        console.log(codes)
    }

    getAirports()

