const apiKey = '364db05531886997b15abe674fea74c6';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?units=metric&q=';
const apiUrlGeo = 'https://api.openweathermap.org/data/2.5/weather?units=metric&lat=';

// Получаем элементы для обновления
const cityElement = document.querySelector('.city h1');
const tempElement = document.querySelector('.degree h1');
const windElement = document.querySelector('.info h6:nth-child(1)');
const visibilityElement = document.querySelector('.info h6:nth-child(2)');
const feelsLikeElement = document.querySelector('.info h6:nth-child(3)');
const weatherIcon = document.querySelector('.img__container img');
const predictionElement = document.querySelector('.prediction h6');

console.log(
    'safdffdas'
);

// Функция получения погоды по городу
async function getWeather(city) {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
    
    if (response.ok) {
        const data = await response.json();
        updateWeatherUI(data);
    } else {
        console.error('Ошибка загрузки данных');
    }
}

console.log('fadafa');

// Функция получения погоды по координатам
async function getWeatherByCoords(lat, lon) {
    const response = await fetch(apiUrlGeo + lat + '&lon=' + lon + `&appid=${apiKey}`);
    
    if (response.ok) {
        const data = await response.json();
        updateWeatherUI(data);
    } else {
        console.error('Ошибка загрузки данных');
    }
}

// Функция обновления данных в интерфейсе
function updateWeatherUI(data) {
    cityElement.textContent = data.name;
    tempElement.textContent = Math.round(data.main.temp) + '°C';
    windElement.textContent = `Wind: ${Math.round(data.wind.speed)} km/h`;
    visibilityElement.textContent = `Visibility: ${data.visibility / 1000} km`;
    feelsLikeElement.textContent = `Feels Like: ${Math.round(data.main.feels_like)}°C`;
    predictionElement.textContent = data.weather[0].description;

    // Установка иконки погоды
    const weatherCondition = data.weather[0].main;
    console.log(weatherCondition);
    let iconPath = '/assets/weather-new.png'; // Дефолтная иконка

    if (weatherCondition === 'Clouds') {
        iconPath = '/assets/clouds.png';
    } else if (weatherCondition === 'Clear') {
        iconPath = '/assets/clear.png';
    } else if (weatherCondition === 'Rain') {
        iconPath = '/assets/rain.png';
    } else if (weatherCondition === 'Snow') {
        iconPath = '/assets/snow.png';
    } else if (weatherCondition === 'Drizzle') {
        iconPath = '/assets/drizzle.png';
    } else if (weatherCondition === 'Mist') {
        iconPath = '/assets/mist.png';
    }

    weatherIcon.src = iconPath;
}

// Функция получения местоположения пользователя
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                getWeatherByCoords(lat, lon);
            },
            (error) => {
                console.error('Ошибка геолокации: ' + error.message);
                getWeather('Bishkek'); // Если геолокация не сработала, ставим город по умолчанию
            }
        );
    } else {
        console.error('Геолокация не поддерживается');
        getWeather('Bishkek');
    }
}

// Загружаем данные при старте
getLocation();
