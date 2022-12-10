'use strict';
console.log("Program starts")
async function fly_to() {
    try {
        const response = await fetch('http://127.0.0.1:5000/fly_to/EETN');
        const data = await response.json();
        console.log("Data inffo",data)
        append(data)
        return data;
    } catch (error) {
        console.log('Verkkovirhe: ', error)
    }
}
let code = fly_to()