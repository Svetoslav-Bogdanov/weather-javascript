const API_KEY = "aa524c2fce727dda3d67deec1756cbae";


document.getElementById("location").addEventListener("submit", event => {
    event.preventDefault();

    hideUknownCityError();

    resetLocationBlock();

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
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${API_KEY}`)
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
    if(event.target.tagName != "LI"){
        return
    }     
    console.log(event.target.dataset)
})

function searchWeather(coordinates){
    
}
