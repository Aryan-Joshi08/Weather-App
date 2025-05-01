const userTab = document.querySelector("[data-userweather]");
const searchTab = document.querySelector("[data-searchweather]");
const weatherContainer = document.querySelector(".weather-container");
const accessGrant = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchform]");
const loadContainer = document.querySelector(".loading-container");
const userWeather = document.querySelector(".user-weather");
const parameterGet = document.querySelector(".parameter-container");


let currentTab = userTab;
const API_key = "41acfe9178ef48a734b3bcd30518d684";
currentTab.classList.add("current-tab");
getfromSessionStorage();



function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");


        if(!searchForm.classList.contains("active")){
            userWeather.classList.remove("active");
            accessGrant.classList.remove("active");
            searchForm.classList.add("active");
        }

        else{
            searchForm.classList.remove("active");
            userWeather.classList.remove("active");
            getfromSessionStorage();
        }
        
    }
}

function  getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        accessGrant.classList.add("active");
    }

    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeather(coordinates);
    }
}


async function fetchUserWeather(coordinates){
    const {lat, lon} = coordinates;
    accessGrant.classList.remove("active");
    loadContainer.classList.add("active");

    try{
       const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`);

      const data = await response.json();

       loadContainer.classList.remove("active");
       userWeather.classList.add("active");

            renderWeatherInfo(data);
    }

    catch(err) {
        loadContainer.classList.remove("active");
        // Show error message to user
        alert("Failed to fetch weather data. Please try again.");
        console.error(err);
    }

}

function renderWeatherInfo(weatherInfo) {

  const cityName = document.querySelector("[data-cityname]");
  const countryIcon = document.querySelector("[data-countryicon]");
  const desc = document.querySelector("[data-weatherdec]");
  const weatherIcon = document.querySelector("[data-weathericon]");
  const temp = document.querySelector("[data-temp]");
  const windspeed = document.querySelector("[data-windspeed]");
  const humidity = document.querySelector("[data-humidity]");
  const cloud = document.querySelector("[data-cloud]");


countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
desc.innerText = weatherInfo?.weather?.[0]?.description;
weatherIcon.src=`https://openweathermap.org/img/wn/${weatherInfo?.weather?.[0]?.icon}.png`;
temp.innerText = `${Math.round(weatherInfo?.main?.temp)}°C`;
cityName.innerText = weatherInfo?.name || "Unknown";
windspeed.innerText =`${weatherInfo?.wind?.speed}m/s` ;
humidity.innerText = `${weatherInfo?.main?.humidity}%`;
cloud.innerText = `${weatherInfo?.clouds.all}%`;







}

 



userTab.addEventListener("click", () => {
    switchTab(userTab);
})

searchTab.addEventListener("click", () =>{
     switchTab(searchTab);
})


function getLocation() {
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }

    else{
        alert("Geolocation is not supported by your browser");

    }

}

function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

        sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
        fetchUserWeather(userCoordinates);


}


const grantAccessButton = document.querySelector("[data-grant-access]");
grantAccessButton.addEventListener("click" ,getLocation);

const searchInput = document.querySelector("[data-searchinput]");
searchForm.addEventListener("submit", (e) =>{
    e.preventDefault();
    let cityName = searchInput.value;
    if(cityName === ""){
        return;
    }
    else{
        fetchSearchWeatherInfo(cityName);
    }
})


async function fetchSearchWeatherInfo(city){
     loadContainer.classList.add("active");
     userWeather.classList.remove("active");
     accessGrant.classList.remove("active");

try{
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`);
        const data = await response.json();
        loadContainer.classList.remove("active");
        userWeather.classList.add("active");
        renderWeatherInfo(data);
    }


catch{

}


}

