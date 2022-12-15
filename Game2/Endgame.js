async function get_results(){
   try {
        const response = await fetch('http://127.0.0.1:5000/get_player_results/');
        const data = await response.json();
        results.innerText = 'Name: ' + data[0][0] + ' Points: ' + data[0][1] + ' Difficulty: ' + data[0][2]
        return data;
    } catch (error) {
        console.log('Verkkovirhe: ', error)
    }
}

let info
console.log(info)
get_results()

const results = document.getElementById("player_end_info")
results.innerText = info