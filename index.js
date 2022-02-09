const API_KEY = "aa524c2fce727dda3d67deec1756cbae";


document.getElementById("location").addEventListener("submit", event => {
    event.preventDefault();

    hideUknownCityError();

    resetLocationBlock();

    resetCurrentWeather();



    const city = document.getElementById("city").value;

    if (city === "") {
        return;
    }

    fetchAddLocations(city);

})

function resetLocationBlock() {

    document.getElementById("location_block").classList.add("d-none");

    document.getElementById("location_list").innerHTML = "";
}

function hideUknownCityError() {
    document.getElementById("unknown_city_error").classList.add("d-none");
}

function showUnknownCityError() {
    document.getElementById("unknown_city_error").classList.remove("d-none");
}

function displayLocationsList(result) {
    let locationsList = "";

    result.forEach(element => {
        locationsList += `<li class="list-group-item" data-lat="${element.lat}" data-lon="${element.lon}">${element.name}, ${element.country}</li>`

    });

    document.getElementById("location_list").innerHTML = locationsList;

    document.getElementById("location_block").classList.remove("d-none");
}

function fetchAddLocations(city) {
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${API_KEY}`)
        .then(result => result.json())
        .then(result => {
            if (result.length === 0) {

                showUnknownCityError();

                return;
            }

            displayLocationsList(result);

        })
}

document.getElementById("location_list").addEventListener("click", event => {
    if (event.target.tagName != "LI") {
        return
    }
    searchWeather(event.target.dataset)
})

function searchWeather(coordinates) {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=minutely,alerts&appid=${API_KEY}&units=metric&lang=bg`)
        .then(result => result.json())
        .then(result => {

            resetLocationBlock();

            displayCurrentWeather(result.current);

            displayHourlyWeather(result.hourly);

            displayDailyWeather(result.daily);

        })

}

function resetCurrentWeather() {
    document.getElementById("current_weather_icon").src = "";
    document.getElementById("current_weather_temp").innerHTML = "";
    document.getElementById("current_weather_description").innerHTML = "";
    document.getElementById("currtent-weather-block").classList.add("d-none");
}

function displayCurrentWeather(current) {
    document.getElementById("current_weather_icon").src = `https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`

    document.getElementById("current_weather_temp").innerHTML = Math.round(current.temp);

    document.getElementById("current_weather_description").innerHTML = current.weather[0].description.toUpperCase();

    document.getElementById("currtent-weather-block").classList.remove("d-none");

}

function displayHourlyWeather(hourly) {
    const template = '<div class="row"><div class="col-2" id="hourly_weather">#hour#</div><div class="col-2"><img src="https://openweathermap.org/img/wn/#icon#@2x.png" width="20" height="20"></div><div class="col">#temp# &deg;C</div></div>';

    let blockHtml = "";

    const today = new Date();

    hourly.forEach(hourData => {

        const date = new Date(hourData.dt * 1000);

        if (today.getDate() === date.getDate()) {


            blockHtml += template.replace("#hour#", formatTime(date.getHours()) + ":" + formatTime(date.getMinutes()))
                .replace("#icon#", hourData.weather[0].icon)
                .replace("#temp#", hourData.temp)

        }


    });

    document.getElementById("weather_end_of_the_day").classList.remove("d-none");
    document.getElementById("hourRows").innerHTML = blockHtml;

}

function formatTime(time) {

    if (time < 10) {
        return "0" + time;
    }

    return time;


}

function displayDailyWeather(daily) {
    const template = '<div class="row"><div class="col-2">#day#</div><div class="col-2"><img src="https://openweathermap.org/img/wn/#icon#@2x.png" width="20" height="20"></div><div class="col">#temp# &deg;C</div></div>'

    let htmlBlock = "";

    const currentHour = new Date().getHours();

    daily.forEach(dailyData => {

        const date = new Date(dailyData.dt * 1000);

        htmlBlock += template.replace("#day#", date.getDate())
            .replace("#icon#", dailyData.weather[0].icon)
            .replace("#temp#", getDailyTemp(dailyData.temp));

    });

    document.getElementById("weather_next_seven_days").classList.remove("d-none");
    document.getElementById("dailyRows").innerHTML = htmlBlock;

}

function getDailyTemp(temp){

    let tempValue = "";

    if (currentHour >= 6 && currentHour < 10) {
        tempValue = temp.morn;
    } else if (currentHour >= 10 && currentHour < 18) {
        tempValue = temp.day;
    } else if (currentHour >= 18 && currentHour < 20) {
        tempValue = temp.eve;
    } else if (currentHour >= 20 && currentHour < 6) {
        tempValue = temp.night;
    }

    return tempValue;

}