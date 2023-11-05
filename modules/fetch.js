"use strict";

const urlBase = 'https://api.openweathermap.org/data/2.5/weather'

let api_key = '5d52b849bf450d140f881c0b2412aa21'



export const weatherByCoords = async (lat, lon) => {
    console.log(lat," ",lon)
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`)
    .then(res => res.json())
    .then(res => console.log(res))

}








// https://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=5d52b849bf450d140f881c0b2412aa21

// https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}

//(`${urlBase}?q=${ciudad}&appid=${api_key}&lang=es`