"use strict";


let geoPos = []

const GEO = navigator.geolocation;


const err = () => console.log(e)

const options = {
    maximumAge : 0,
    timeout: 3000, 
    enableHightAccuracy: true
}

export const getPosition = async () => {

    // GEO.getCurrentPosition(pos => {
    //     geoPos.push(pos.coords.latitude)
    //     geoPos.push(pos.coords.longitude)
    // }, err)

    GEO.getCurrentPosition(res, err)

    return geoPos

}

export{geoPos}

// getPosition()

// console.log(geoPos)

