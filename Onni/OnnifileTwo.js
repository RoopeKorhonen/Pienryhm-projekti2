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
                current_airport = data.ident[i]
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
                const h2text = document.createElement('h2');
                h2text.innerText = airport.name;
                goButton.innerText = 'Fly here';
                goButton.classList.add('button');
                popupContent.append(goButton);
                popupContent.append(h2text);

                goButton.addEventListener('click', function () {
                    current_airport = airport.ident
                    console.log(current_airport)
                    generateAirports();
                });

                marker.bindPopup(popupContent);
            }
        }
    }

    getAirports()
