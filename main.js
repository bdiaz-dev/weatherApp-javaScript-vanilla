"use strict";

// User

    // Language
    let lang = (navigator.language).substring(0, 2);

    // Farenheith / Celsius
    let Celsius = true
    const farenheithFormule = (celsius) => Math.round((celsius * 9 / 5) + 32)

    // Miles / Kilometres
    let Kilometres = true
    const milesFormule = (kilometres) => Math.round(kilometres / 1.609)

// 

// dates Openweather

    const urlBase = 'https://api.openweathermap.org/data/2.5/'

    const urlImg = './assets/img/'//'https://openweathermap.org/img/wn/' //10d' //@2x.png'

    let api_key = '5d52b849bf450d140f881c0b2412aa21'

    let units = 'metric'

//

// get Weather by Geolocation

    const GEO = navigator.geolocation;

    const getWeatherByPos = async () => {
        GEO.getCurrentPosition(pos => {
            let lat = pos.coords.latitude
            let lon = pos.coords.longitude
            fetch(`${urlBase}weather?lat=${lat}&lon=${lon}&units=${units}&lang=${lang}&appid=${api_key}`)
            .then(res => res.json())
            .then(res => {
                changeFrontWeather(res)
                changeDetails(res)
                addToList(`${res.name}, ${res.sys.country}`)
            })
            .catch(err => console.log(err))

            fetch(`${urlBase}forecast/?lat=${lat}&lon=${lon}&units=${units}&lang=${lang}&appid=${api_key}`)
            .then(res => res.json())
            .then(res => {
                changePrevCards(res)
            })
            
        }, e => {console.log("Error: ",e.message)})
    }

// 

// get Weather by City

    const getWeatherByCity = async (city) => {

            fetch(`${urlBase}weather?q=${city}&units=${units}&lang=${lang}&appid=${api_key}`)
            .then(res => res.json())
            .then(res => {
                changeFrontWeather(res)
                changeDetails(res)
                addToList(`${res.name}, ${res.sys.country}`)
                closeMenu()
            })
            .catch(err => console.log(err))

            fetch(`${urlBase}forecast/?q=${city}&units=${units}&lang=${lang}&appid=${api_key}`)
            .then(res => res.json())
            .then(res => {
                console.log(res)
                changePrevCards(res)
            })
    }

// 

// DOM Constants

    const frontWeatherCity = document.getElementById("front_weather--city")
    const frontWeatherResume = document.getElementById("front_weather--resume")
    const frontWeatherImage = document.getElementById("front_weather--img")
    const frontWeatherTemp = document.getElementById("front_weather--temp")
    const frontWeatherTitle = document.querySelector("h1")

    const prevCards = document.querySelectorAll('.prev')
    const detailsCards = document.querySelectorAll('.detailCard')

    const celsiusButton = document.querySelector('.celsiusButton')
    const farenButton = document.querySelector('.farenButton')

    const sideTitles = document.querySelectorAll('.sideCards--titles')

    const menuList = document.querySelector('.fa-list')
    const menuX = document.querySelector('.closeButton')
    const menu = document.querySelector('nav')
    const editPlacesButton = document.querySelector('.editPlacesButton')
    const editButtonsBox = document.querySelector('.editButtonsBox')
    const cancelEditButton = document.querySelector('.cancelEditButton')
    const deleteAllButton = document.querySelector('.deleteAllButton')

    const searchBox = document.querySelector('input')
    const searchButton = document.querySelector('.searchButton')
    const citiesList = document.querySelector('ul')
    const locationButton = document.querySelector('.fa-location-crosshairs')

//

// Units Buttons

    Celsius ? celsiusButton.classList.add('active') : farenButton.classList.add('active')


    celsiusButton.addEventListener('click', () => {
        
        if (!Celsius) {
            celsiusButton.classList.add('active');
            farenButton.classList.remove('active');
            Celsius = true;
            Kilometres = true;
            getWeatherByPos();
        }
        
    })

    farenButton.addEventListener('click', () => {

        if (Celsius) {
            celsiusButton.classList.remove('active');
            farenButton.classList.add('active');
            Celsius = false;
            Kilometres = false;
            getWeatherByPos();
        }
     
    })

//

// traductor

    if (lang == 'es'){
        sideTitles[0].innerHTML = 'Próximas horas'
        sideTitles[1].innerHTML = 'Detalles tiempo actual'
        frontWeatherTitle.innerHTML = 'Tiempo actual'
        cancelEditButton.innerHTML =  'Cancelar'
        editPlacesButton.innerHTML =  'Editar lista'
        deleteAllButton.innerHTML =  'Borrar todo'
    } else {
        sideTitles[0].innerHTML = 'Next hours'
        sideTitles[1].innerHTML = 'Weather now details'
        frontWeatherTitle.innerHTML = 'Weather now'
        cancelEditButton.innerHTML = 'Cancel'
        editPlacesButton.innerHTML = 'Edit places'
        deleteAllButton.innerHTML = 'Delete all'
    }

//

// open & close: Menu & Buttons

    // open menu
    menuList.addEventListener('click', () => {
        menu.style.left = "0"
        console.log(menu)
    })

    // close menu
    const closeMenu = () => {
        menu.style.left = "-35em"
        console.log(menu)
        cancelEdit()
    }
    menuX.addEventListener('click', closeMenu)

    // edit mode ON
    editPlacesButton.addEventListener('click', () => {
        const allLis = document.querySelectorAll('b');
        if (allLis.length > 0) {
            editButtonsBox.style.left = "25%"
            editPlacesButton.style.opacity = "0"
            const XDelete = document.querySelectorAll('.removeButton')
            XDelete.forEach((x) => { x.style.display = "inline" })
        }
    })

    // edit mode OFF
    const cancelEdit = () =>{
        editPlacesButton.style.opacity = "1"
        editButtonsBox.style.left = "-70%"
        const XDelete = document.querySelectorAll('.removeButton')
        XDelete.forEach((x) => { x.style.display = "none" })
    }
    cancelEditButton.addEventListener('click', cancelEdit)

//






// Update Front Actual Weather

    const changeFrontWeather = data => {

        let description = (data.weather[0].description).charAt(0).toUpperCase() 
            + (data.weather[0].description).slice(1);

        frontWeatherCity.innerHTML = `<i class="fa-solid fa-location-dot" style="margin-right:0.4em"></i> 
            ${data.name}, ${data.sys.country}`;
        frontWeatherResume.innerHTML = description
        frontWeatherImage.src = `${urlImg}${data.weather[0].icon}.png`
        frontWeatherTemp.innerHTML = Celsius ? `${Math.round(data.main.temp)}ºC` : `${farenheithFormule(data.main.temp)}ºF`
    }

//


// side cards updater

    const changePrevCards = data => {
        prevCards.forEach((card, index) =>{
            let description = data.list[index+1].weather[0].description
            description = description.charAt(0).toUpperCase()+description.slice(1)

            let hour = (data.list[index+1].dt_txt).substring(11, 16)

            const temp = Celsius ? `${Math.round(data.list[index+1].main.temp)}ºC` : `${farenheithFormule(data.list[index+1].main.temp)}ºF`

            card.innerHTML = `
            <p class="p1">${hour} h</p> 
            <img src = ${urlImg}${data.list[index+1].weather[0].icon}.png>
            <p class="p2">${temp}</p>
            <p class="p1">${description}</p>
            `
        })
    }

    const changeDetails = data => {

        // restore cards
        detailsCards.forEach((card) =>{
            card.innerHTML = ""
        })

        //data const
        const feelsLike =data.main.feels_like;
        const humidity = data.main.humidity;
        const temp = [Math.round(data.main.temp_min), Math.round(data.main.temp_max)];
        const wind = () => {
            const wind =[]
            if (data.wind.deg == 0) wind.push('N');
            if (data.wind.deg > 0 && data.wind.deg < 90) wind.push('NE');
            if (data.wind.deg == 90) wind.push ('E');
            if (data.wind.deg > 90 && data.wind.deg < 180) wind.push('SE');
            if (data.wind.deg == 180) wind.push('S');
            if (data.wind.deg > 180 && data.wind.deg < 270) wind.push('SW');
            if (data.wind.deg == 270) wind.push('W');
            if (data.wind.deg > 270 && data.wind.deg < 360) wind.push('NW')
            wind.push(data.wind.speed*3.6);
            return wind
        }

        //DOM const & edit
        const feelsLikeTitle = document.createElement('p')
        const feelsLikeData = document.createElement('p')
        const humidityTitle = document.createElement('p')
        const humidityData = document.createElement('p')
        const tempTitle = document.createElement('p')
        const tempData = document.createElement('p')
        const windTitle = document.createElement('p')
        const windSpeed = document.createElement('p')
        const windDirection = document.createElement('p')

        const windIcon = document.createElement('i')
        const tempIcon = document.createElement('i')
        const humiIcon = document.createElement('i')
        const feelIcon = document.createElement('i')

        feelsLikeTitle.innerHTML = (lang == 'es')? `Sensación térmica` : `Feels Like`;
        feelsLikeTitle.classList.add('p2');
        feelsLikeData.innerHTML = Celsius ? `${Math.round(feelsLike)} ºC` : `${farenheithFormule(feelsLike)} ºF`;
        feelsLikeData.classList.add('p2')
        feelIcon.innerHTML = `<i class="fa-solid fa-person fa-6x detailsIcon"></i>`
        detailsCards[0].appendChild(feelsLikeTitle);
        detailsCards[0].appendChild(feelIcon);
        detailsCards[0].appendChild(feelsLikeData);

        humidityTitle.innerHTML = (lang == 'es')? `Humedad` : `Humidity`;
        humidityTitle.classList.add('p2');
        humidityData.innerHTML = `${humidity} %`
        humidityData.classList.add('p2')
        humiIcon.innerHTML = `<i class="fa-solid fa-droplet fa-6x detailsIcon"></i>`
        detailsCards[1].appendChild(humidityTitle);
        detailsCards[1].appendChild(humiIcon);
        detailsCards[1].appendChild(humidityData);

        tempTitle.innerHTML = `Min / Max`;
        tempTitle.classList.add('p2');
        tempData.innerHTML = `${temp[0]} º / ${temp[1]} º`
        tempData.classList.add('p2')
        tempIcon.innerHTML = `<i class="fa-solid fa-temperature-high fa-6x detailsIcon"></i>`
        detailsCards[2].appendChild(tempTitle);
        detailsCards[2].appendChild(tempIcon);
        detailsCards[2].appendChild(tempData);

        windTitle.innerHTML = (lang == 'es')? `Viento` : `Wind`;
        windTitle.classList.add('p2')
        // windSpeed.innerHTML = `${wind()[0]}`+'\n';
        windSpeed.innerHTML += Kilometres ? `${(wind()[1]).toFixed(2)} km/h` : `${(milesFormule(wind()[1])).toFixed(2)} m/h`;
        windSpeed.classList.add('p2')
        windDirection.innerHTML = wind()[0];
        windDirection.classList.add('direction', 'detailsIcon')
        windIcon.innerHTML = `<i style="--fa-rotate-angle:${data.wind.deg}deg" class="fa-solid fa-up-long fa-7x detailsIcon fa-rotate-by"></i>`
        detailsCards[3].appendChild(windTitle);
        detailsCards[3].appendChild(windIcon);
        detailsCards[3].appendChild(windDirection);
        detailsCards[3].appendChild(windSpeed);

    }

//

// Cities list & search functionalities

    const addToList = (searched) => {

        // control for not add to list if there is already the same city

        let cont = true // default control

        const allLis = document.querySelectorAll('li'); // get the list
        if (allLis.length > 0){ // if the list is not empty, control de city name
            allLis.forEach((li) =>{
                if (searched == li.innerText) {cont = false} //if there is already the city, change variable control to false - childNodes[0].data
            })
        }

        if (cont) {
            
            const li = document.createElement('li');
            const cityName = document.createElement('b')
            cityName.innerHTML = `${searched} `
            cityName.classList.add('cityNameLi')
            const XDelete = document.createElement("i");
            XDelete.classList.add("fa-solid","fa-xmark","removeButton")
            XDelete.style.display = "none"
            li.append(cityName, XDelete)
            citiesList.appendChild(li)
            cityName.addEventListener('click', () => {
                console.log(li)
                getWeatherByCity(li.textContent)
            })

            // local storage
            const storageFunction = () => {
                let storage = []
                let allLis = document.querySelectorAll('li')
                    allLis.forEach((li) => {
                        storage.push(li.innerText)
                    })
                localStorage.setItem('cities', JSON.stringify(storage))
            }
            storageFunction()


            // delete element of list function
            XDelete.addEventListener('click', () => {
                citiesList.removeChild(li)
                const allLis = document.querySelectorAll('li')
                if (allLis.length <= 0) {cancelEdit()}
                storageFunction()
            })



        }
        searchBox.value = ""
    }

    const searchPlace = () => {
        if (searchBox.value != "") {
            document.activeElement.blur()
            getWeatherByCity(searchBox.value);
        }
    }
    searchButton.addEventListener('click', searchPlace)
    document.addEventListener( 'keydown', (e) => { if (e.key == 'Enter') searchPlace() } )

    deleteAllButton.addEventListener('click', async () => {
        if ( confirm((lang == 'es')? '¿Confirmas que quieres borrar toda la lista de ubicaciones?' : 'Are you sure to delete all the places on the list?')) {
            citiesList.innerHTML = ""
        }
    })

    locationButton.addEventListener('click', () => {
        getWeatherByPos();
        closeMenu()
    })




//

// initial functions -> get localStorage saved & weather by position

    const initialStorage = [...JSON.parse(localStorage.getItem('cities'))]
    initialStorage.forEach((city) => {
        addToList(city)
    })
    getWeatherByPos()

//


//"https://www.flaticon.com/free-icons/sun" - Sun icons created by iconixar - Flaticon


