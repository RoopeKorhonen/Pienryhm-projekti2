
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
  player_info()

let target = document.getElementById('lol')

const map = L.map('map')
/* for (let i = 0; i <= 10; i++){
    target.innerText += 'ei vidddu miden ebin juddu :DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD'
} */

    const options = {
      enableHighAccuracy: true,
      timeout: 9000,
      maximumAge: 0,
    };

    // A function that is called when location information is retrieved
    function success(pos) {
      const crd = pos.coords;

      // Printing location information to the console
      console.log('Your current position is:');
      console.log(`Latitude : ${crd.latitude}`);
      console.log(`Longitude: ${crd.longitude}`);
      console.log(`More or less ${crd.accuracy} meters.`);

      // Use the leaflet.js library to show the location on the map (https://leafletjs.com/)
      map.setView([crd.latitude, crd.longitude], 1);

      /* for (let i = 0; i <= 10; i++){
          let lat = Math.floor(Math.random() * 700)
          let long = Math.floor(Math.random() * 600)
          L.marker([lat, long]).addTo(map).bindPopup(i)
          console.log(i, lat, long)
      } */

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      L.marker([crd.latitude, crd.longitude]).addTo(map)
      .bindPopup('I am here.')
      .openPopup();
    }

    // Function to be called if an error occurs while retrieving location information
    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    // Starts the location search
    navigator.geolocation.getCurrentPosition(success, error, options);

    let marker = ''
    const airports = L.featureGroup().addTo(map);
    async function getAirport(){
        try{
        const response = await fetch('http://127.0.0.1:5000/airport/self');
        const data = await response.json();
        airports.clearLayers();

        for (let i = 0; i !== data.latitude_deg.length; i++){

            let icao = data.ident[i];
            let name = data.name[i];
            let active = false;
            let lat = data.latitude_deg[i];
            let long = data.longitude_deg[i];
            console.log(name, lat, long)

            marker = L.marker([lat, long]).addTo(map)
            airports.addLayer(marker)
            //marker.bindPopup('Airport: ' + name + " Icao: " + icao)
            if (active === false) {
                const popupContent = document.createElement('div')
                const goButton = document.createElement('button')
                const h2text = document.createElement('h2')
                h2text.innerText = name
                goButton.innerText = 'Fly here'
                goButton.classList.add('button')
                popupContent.append(goButton)
                popupContent.append(h2text)
                goButton.addEventListener('click', function () {
                    console.log(icao)
                    active = true
                    popupContent.innerText = 'You are here: ' + name
                    marker.setPopupContent(popupContent)
                });
                marker.bindPopup(popupContent)
            } else {
                marker.bindPopup('You are here')
            }
        }

        /* note to self: lentokentät jotka luodaan alussa menee erikoiseen JSONiin jota tämä JS lukee
            sitten kun pelaaja lentää joihinkin niistä niin lentokentän active bool muutuu trueksi
            ja sitten falseksi kun he lentävät pois sieltä*/

        console.log('result', data);
        //renderResult(data);
        return data
        } catch (error){
            console.log('Verkkovirhe: ', error)
        }
    }

    getAirport()