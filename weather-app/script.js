const cityInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const searchedLocation = document.getElementById("searchedLocation");
const dateToday = document.getElementById("dateToday");
const weatherCloudImage = document.querySelector(".weather-cloud img");
const weatherCloudDescription = document.querySelector(".weather-cloud h4");
const currentWeatherDiv = document.querySelector(".location-weather");

const API_KEY = "74bdea3d5e3168e5fe68db26434058e5";

const createWeatherCard = (cityName, weatherItem) => {
    return `
        <div class="location-weather">
            <small>Temperature: ${weatherItem.main.temp / 10}°C</small>
            <small>Wind: ${weatherItem.wind.speed} km/h</small>
            <small>Humidity: ${weatherItem.main.humidity}%</small>
        </div>`;
};

const updatePageContent = (cityName, weatherItem) => {
    searchedLocation.textContent = cityName;
    
    const currentDate = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true };
    dateToday.textContent = currentDate.toLocaleDateString('en-US', options);

    weatherCloudImage.src = `https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png`;
    weatherCloudDescription.textContent = weatherItem.weather[0].main;

    const currentWeatherHTML = createWeatherCard(cityName, weatherItem);
    currentWeatherDiv.innerHTML = currentWeatherHTML;
};

const getWeatherDetails = (cityName, latitude, longitude) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL)
        .then(response => response.json())
        .then(data => {
            cityInput.value = "";

            updatePageContent(cityName, data);
        })
        .catch(error => {
            console.error("An error occurred while fetching the weather forecast:", error);
            alert("An error occurred while fetching the weather forecast!");
        });
};

const getCityCoordinates = () => {
    document.querySelector('.weather-container').style.display = "";
    const cityName = cityInput.value.trim();
    if (cityName === "") return;

    const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`;

    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            const { coord } = data;
            if (!coord) {
                alert(`No coordinates found for ${cityName}`);
                return;
            }
            getWeatherDetails(cityName, coord.lat, coord.lon);
        })
        .catch(error => {
            console.error("An error occurred while fetching the coordinates:", error);
            alert("An error occurred while fetching the coordinates!");
        });
};

searchButton.addEventListener("click", getCityCoordinates);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());
