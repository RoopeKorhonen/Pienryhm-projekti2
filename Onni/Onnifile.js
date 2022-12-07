target = document.getElementById('lol')


for (let i = 0; i <= 10; i++){
    target.innerText += 'ei vidddu miden ebin juddu :DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD'
}

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
      const map = L.map('map').setView([crd.latitude, crd.longitude], 1);

      for (let i = 0; i <= 10; i++){
          let lat = Math.floor(Math.random() * 700)
          let long = Math.floor(Math.random() * 600)
          L.marker([lat, long]).addTo(map).bindPopup(i)
          console.log(i, lat, long)
      }

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


    async function getAirport(icao){
        try{
        const response = await fetch('http://127.0.0.1:5000/get_airport/' + icao);
        const data = await response.json();

        console.log('result', data);
        //renderResult(data);
        return data
        } catch (error){
            console.log('Verkkovirhe: ', error)
        }
    }

    getAirport('Finland')
