// Weather Dashboard Script
// Using Open-Meteo API (Free, No API Key Required)

const API_BASE_URL = 'https://api.open-meteo.com/v1';
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';

const elements = {
    searchInput: document.getElementById('searchInput'),
    searchBtn: document.getElementById('searchBtn'),
    locationBtn: document.getElementById('locationBtn'),
    suggestions: document.getElementById('suggestions'),
    errorMsg: document.getElementById('errorMsg'),
    loadingSpinner: document.getElementById('loadingSpinner'),
    currentWeather: document.getElementById('currentWeather'),
    forecastSection: document.getElementById('forecastSection'),
    hourlySection: document.getElementById('hourlySection'),
    recentSearches: document.getElementById('recentSearches'),
};

let searchHistory = JSON.parse(localStorage.getItem('weatherSearchHistory')) || [];

// Event Listeners
elements.searchBtn.addEventListener('click', () => searchWeather());
elements.searchInput.addEventListener('keypress', (e) => e.key === 'Enter' && searchWeather());
elements.searchInput.addEventListener('input', handleSearchInput);
elements.locationBtn.addEventListener('click', getUserLocation);

// Search weather by city name
async function searchWeather() {
    const cityName = elements.searchInput.value.trim();
    if (!cityName) {
        showError('Please enter a city name');
        return;
    }

    try {
        showLoading(true);
        clearError();
        elements.suggestions.classList.remove('show');

        // Get coordinates for city
        const geoData = await getCoordinates(cityName);
        if (!geoData) {
            showError('City not found');
            return;
        }

        const { name, country, latitude, longitude } = geoData;
        
        // Add to search history
        addToSearchHistory(`${name}, ${country}`);
        
        // Fetch weather data
        await fetchWeatherData(latitude, longitude, `${name}, ${country}`);
        
        showLoading(false);
        elements.searchInput.value = '';
    } catch (error) {
        console.error('Error:', error);
        showError('Failed to fetch weather data');
        showLoading(false);
    }
}

// Get coordinates from city name
async function getCoordinates(cityName) {
    try {
        const response = await fetch(`${GEOCODING_URL}?name=${cityName}&count=1&language=en&format=json`);
        const data = await response.json();
        
        if (!data.results || data.results.length === 0) {
            return null;
        }
        
        const result = data.results[0];
        return {
            name: result.name,
            country: result.country,
            latitude: result.latitude,
            longitude: result.longitude,
        };
    } catch (error) {
        console.error('Geocoding error:', error);
        return null;
    }
}

// Fetch weather data
async function fetchWeatherData(lat, lon, location) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,pressure_msl,visibility&timezone=auto&forecast_days=5&hourly=temperature_2m,weather_code,wind_speed_10m`
        );
        const data = await response.json();
        
        if (!data.current) {
            showError('Unable to fetch weather data');
            return;
        }

        displayCurrentWeather(data, location);
        displayForecast(data);
        displayHourlyForecast(data);
        
    } catch (error) {
        console.error('Weather fetch error:', error);
        showError('Failed to fetch weather data');
    }
}

// Display current weather
function displayCurrentWeather(data, location) {
    const current = data.current;
    const daily = data.daily ? data.daily.weather_code[0] : null;
    const weatherDescription = getWeatherDescription(current.weather_code);
    const weatherIcon = getWeatherIcon(current.weather_code);

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    document.getElementById('cityName').textContent = location;
    document.getElementById('dateTime').textContent = `${dateStr} at ${timeStr}`;
    document.getElementById('temp').textContent = Math.round(current.temperature_2m);
    document.getElementById('description').textContent = weatherDescription;
    document.getElementById('feelsLike').textContent = `Feels like ${Math.round(current.apparent_temperature)}°C`;
    document.getElementById('humidity').textContent = `${current.relative_humidity_2m}%`;
    document.getElementById('windSpeed').textContent = `${Math.round(current.wind_speed_10m)} km/h`;
    document.getElementById('pressure').textContent = `${Math.round(current.pressure_msl)} hPa`;
    document.getElementById('visibility').textContent = `${(current.visibility / 1000).toFixed(1)} km`;
    document.getElementById('weatherIcon').src = weatherIcon;
    document.getElementById('weatherIcon').alt = weatherDescription;

    if (data.daily) {
        const highTemp = data.daily.temperature_2m_max[0];
        const lowTemp = data.daily.temperature_2m_min[0];
        document.getElementById('highTemp').textContent = `${Math.round(highTemp)}°C`;
        document.getElementById('lowTemp').textContent = `${Math.round(lowTemp)}°C`;
    }

    if (data.daily && data.daily.sunrise && data.daily.sunset) {
        const sunrise = new Date(data.daily.sunrise[0]).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const sunset = new Date(data.daily.sunset[0]).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        document.getElementById('sunrise').textContent = sunrise;
        document.getElementById('sunset').textContent = sunset;
    }

    elements.currentWeather.classList.remove('hidden');
}

// Display 5-day forecast
function displayForecast(data) {
    if (!data.daily) return;

    const forecastContainer = document.getElementById('forecastContainer');
    forecastContainer.innerHTML = '';

    for (let i = 1; i < 5; i++) {
        const date = new Date(data.daily.time[i]);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const dayDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        const high = Math.round(data.daily.temperature_2m_max[i]);
        const low = Math.round(data.daily.temperature_2m_min[i]);
        const weatherCode = data.daily.weather_code[i];
        const description = getWeatherDescription(weatherCode);
        const icon = getWeatherIcon(weatherCode);

        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <div class="date">${dayName}<br>${dayDate}</div>
            <img src="${icon}" alt="${description}" style="width: 50px; height: 50px;">
            <div class="temp">${high}° / ${low}°</div>
            <div class="description">${description}</div>
        `;
        forecastContainer.appendChild(card);
    }

    document.getElementById('forecastSection').classList.remove('hidden');
}

// Display hourly forecast
function displayHourlyForecast(data) {
    if (!data.hourly) return;

    const hourlyContainer = document.getElementById('hourlyContainer');
    hourlyContainer.innerHTML = '';

    const now = new Date();
    const currentHour = now.getHours();
    
    for (let i = 0; i < 24; i++) {
        const hourIndex = currentHour + i;
        if (hourIndex >= data.hourly.time.length) break;

        const time = new Date(data.hourly.time[hourIndex]);
        const timeStr = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        
        const temp = Math.round(data.hourly.temperature_2m[hourIndex]);
        const weatherCode = data.hourly.weather_code[hourIndex];
        const icon = getWeatherIcon(weatherCode);

        const card = document.createElement('div');
        card.className = 'hourly-card';
        card.innerHTML = `
            <div class="time">${timeStr}</div>
            <img src="${icon}" alt="weather" style="width: 40px; height: 40px;">
            <div class="temp">${temp}°</div>
        `;
        hourlyContainer.appendChild(card);
    }

    document.getElementById('hourlySection').classList.remove('hidden');
}

// Get weather description from WMO code
function getWeatherDescription(code) {
    const weatherCodes = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Foggy',
        48: 'Depositing rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        71: 'Slight snow',
        73: 'Moderate snow',
        75: 'Heavy snow',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        85: 'Slight snow showers',
        86: 'Heavy snow showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with slight hail',
        99: 'Thunderstorm with heavy hail',
    };
    return weatherCodes[code] || 'Unknown';
}

// Get weather icon
function getWeatherIcon(code) {
    const iconMap = {
        0: '☀️',
        1: '🌤️',
        2: '⛅',
        3: '☁️',
        45: '🌫️',
        48: '🌫️',
        51: '🌦️',
        53: '🌦️',
        55: '🌦️',
        61: '🌦️',
        63: '🌦️',
        65: '⛈️',
        71: '❄️',
        73: '❄️',
        75: '❄️',
        80: '🌦️',
        81: '⛈️',
        82: '⛈️',
        85: '🌨️',
        86: '🌨️',
        95: '⛈️',
        96: '⛈️',
        99: '⛈️',
    };
    return iconMap[code] || '🌤️';
}

// Handle search input for suggestions
async function handleSearchInput(e) {
    const query = e.target.value.trim();
    
    if (query.length < 2) {
        elements.suggestions.classList.remove('show');
        return;
    }

    try {
        const response = await fetch(`${GEOCODING_URL}?name=${query}&count=5&language=en&format=json`);
        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            elements.suggestions.classList.remove('show');
            return;
        }

        elements.suggestions.innerHTML = '';
        data.results.forEach(result => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.textContent = `${result.name}, ${result.country}`;
            item.addEventListener('click', async () => {
                elements.searchInput.value = '';
                showLoading(true);
                addToSearchHistory(`${result.name}, ${result.country}`);
                await fetchWeatherData(result.latitude, result.longitude, `${result.name}, ${result.country}`);
                elements.suggestions.classList.remove('show');
                showLoading(false);
            });
            elements.suggestions.appendChild(item);
        });

        elements.suggestions.classList.add('show');
    } catch (error) {
        console.error('Suggestion error:', error);
    }
}

// Get user location
function getUserLocation() {
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by your browser');
        return;
    }

    showLoading(true);
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            
            try {
                // Get location name from coordinates
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                );
                const data = await response.json();
                const locationName = data.address?.city || data.address?.town || data.address?.village || 'Your Location';
                
                await fetchWeatherData(latitude, longitude, locationName);
                addToSearchHistory(locationName);
            } catch (error) {
                await fetchWeatherData(latitude, longitude, 'Your Location');
            }
            
            showLoading(false);
        },
        (error) => {
            console.error('Geolocation error:', error);
            showError('Unable to get your location');
            showLoading(false);
        }
    );
}

// Add to search history
function addToSearchHistory(city) {
    searchHistory = searchHistory.filter(item => item !== city);
    searchHistory.unshift(city);
    searchHistory = searchHistory.slice(0, 10);
    localStorage.setItem('weatherSearchHistory', JSON.stringify(searchHistory));
    displaySearchHistory();
}

// Display search history
function displaySearchHistory() {
    if (searchHistory.length === 0) {
        elements.recentSearches.innerHTML = '<p class="recent-empty">No recent searches</p>';
        return;
    }

    elements.recentSearches.innerHTML = '';
    searchHistory.forEach(city => {
        const item = document.createElement('div');
        item.className = 'recent-item';
        item.textContent = city;
        item.addEventListener('click', () => {
            elements.searchInput.value = city;
            searchWeather();
        });
        elements.recentSearches.appendChild(item);
    });
}

// Utility functions
function showLoading(show) {
    elements.loadingSpinner.classList.toggle('hidden', !show);
}

function showError(message) {
    elements.errorMsg.textContent = message;
    elements.errorMsg.classList.add('show');
    setTimeout(() => clearError(), 5000);
}

function clearError() {
    elements.errorMsg.classList.remove('show');
}

// Initialize
displaySearchHistory();

// Default city on load
window.addEventListener('load', async () => {
    // Optional: Load default city
    // await searchWeather('London');
});