const API_KEY = "aa524c2fce727dda3d67deec1756cbae";


document.getElementById("location").addEventListener("submit", event => {
    event.preventDefault();

    document.getElementById("unknown_city_error").classList.add("d-none");


    const city = document.getElementById("city").value;

    if(city === ""){
        return;
    }


    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${API_KEY}`)
        .then(result => result.json())
        .then(result => {
            if(result.length === 0){
                document.getElementById("unknown_city_error").classList.remove("d-none");
            }            
        })
})

