// Configuration API
const API_KEY = 'c4e92ab59bf6ec41660f726557582461';

// Éléments du DOM
const elements = {
    // Navigation
    tabSearch: document.getElementById('tab-search'),
    tabGeo: document.getElementById('tab-geo'),
    viewSearch: document.getElementById('view-search'),
    viewGeo: document.getElementById('view-geo'),
    appContainer: document.getElementById('app-container'),
    
    // Recherche
    cityInput: document.getElementById('city-input'),
    searchButton: document.getElementById('search-button'),
    resultSearch: document.getElementById('weather-result-search'),
    errorSearch: document.getElementById('error-message-search'),
    
    // Géolocalisation
    loadingSpinner: document.getElementById('loading-spinner'),
    loadingMessage: document.getElementById('loading-message'),
    errorGeo: document.getElementById('error-message-geo'),
    geoCityName: document.getElementById('geo-city-name'),
    currentWeatherGeo: document.getElementById('current-weather-geo'),
    forecastSection: document.getElementById('forecast-section'),
    forecastContainer: document.getElementById('forecast-5-days')
};

// =========================================================================
//                          GESTION DE L'INTERFACE
// =========================================================================

/**
 * Change la vue active
 */
function switchView(viewId) {
    // Masquer toutes les vues
    elements.viewSearch.classList.add('hidden');
    elements.viewGeo.classList.add('hidden');
    elements.tabSearch.classList.remove('active');
    elements.tabGeo.classList.remove('active');
    
    // Afficher la vue demandée
    if (viewId === 'search') {
        elements.viewSearch.classList.remove('hidden');
        elements.tabSearch.classList.add('active');
        elements.cityInput.focus();
    } else if (viewId === 'geo') {
        elements.viewGeo.classList.remove('hidden');
        elements.tabGeo.classList.add('active');
        handleGeolocation();
    }
}

/**
 * Applique un style dynamique selon la météo
 */
function updateDynamicStyle(condition) {
    elements.appContainer.className = 'app-container';
    document.body.className = '';
    
    // Supprimer les anciens effets météo
    const oldEffect = document.querySelector('.weather-effect');
    if (oldEffect) oldEffect.remove();
    
    const lowerCondition = condition.toLowerCase();
    
    if (lowerCondition.includes('clear')) {
        document.body.classList.add('weather-clear');
        elements.appContainer.classList.add('weather-clear');
        createSunEffect();
    } else if (lowerCondition.includes('cloud')) {
        document.body.classList.add('weather-clouds');
        elements.appContainer.classList.add('weather-clouds');
        createCloudsEffect();
    } else if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) {
        document.body.classList.add('weather-rain');
        elements.appContainer.classList.add('weather-rain');
        createRainEffect();
    } else if (lowerCondition.includes('storm') || lowerCondition.includes('thunder')) {
        document.body.classList.add('weather-storm');
        elements.appContainer.classList.add('weather-storm');
        createStormEffect();
    } else if (lowerCondition.includes('snow')) {
        document.body.classList.add('weather-snow');
        elements.appContainer.classList.add('weather-snow');
        createSnowEffect();
    }
}

/**
 * Crée l'effet de soleil
 */
function createSunEffect() {
    const effect = document.createElement('div');
    effect.className = 'weather-effect';
    effect.innerHTML = '<div class="sun-effect"></div>';
    document.body.appendChild(effect);
}

/**
 * Crée l'effet de nuages
 */
function createCloudsEffect() {
    const effect = document.createElement('div');
    effect.className = 'weather-effect clouds-effect';
    
    for (let i = 0; i < 8; i++) {
        const cloud = document.createElement('div');
        cloud.className = 'cloud';
        const width = 100 + Math.random() * 150;
        const height = 50 + Math.random() * 50;
        
        cloud.style.width = `${width}px`;
        cloud.style.height = `${height}px`;
        cloud.style.top = `${Math.random() * 70}%`;
        cloud.style.left = `-${width}px`;
        cloud.style.animationDuration = `${25 + Math.random() * 35}s`;
        cloud.style.animationDelay = `${Math.random() * 15}s`;
        
        effect.appendChild(cloud);
    }
    
    document.body.appendChild(effect);
}

/**
 * Crée l'effet de pluie
 */
function createRainEffect() {
    const effect = document.createElement('div');
    effect.className = 'weather-effect rain-effect';
    
    // Créer 100 gouttes de pluie
    for (let i = 0; i < 100; i++) {
        const drop = document.createElement('div');
        drop.className = 'rain-drop';
        drop.style.left = `${Math.random() * 100}%`;
        drop.style.animationDuration = `${0.5 + Math.random() * 0.5}s`;
        drop.style.animationDelay = `${Math.random() * 2}s`;
        effect.appendChild(drop);
    }
    
    document.body.appendChild(effect);
}

/**
 * Crée l'effet de neige
 */
function createSnowEffect() {
    const effect = document.createElement('div');
    effect.className = 'weather-effect snow-effect';
    
    for (let i = 0; i < 80; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.textContent = '❄';
        snowflake.style.left = `${Math.random() * 100}%`;
        snowflake.style.animationDuration = `${4 + Math.random() * 8}s`;
        snowflake.style.animationDelay = `${Math.random() * 5}s`;
        snowflake.style.fontSize = `${0.8 + Math.random() * 1.2}em`;
        snowflake.style.opacity = `${0.6 + Math.random() * 0.4}`;
        effect.appendChild(snowflake);
    }
    
    document.body.appendChild(effect);
}

/**
 * Crée l'effet d'orage
 */
function createStormEffect() {
    const effect = document.createElement('div');
    effect.className = 'weather-effect';
    
    // Ajouter la pluie
    const rainContainer = document.createElement('div');
    rainContainer.className = 'rain-effect';
    
    for (let i = 0; i < 100; i++) {
        const drop = document.createElement('div');
        drop.className = 'rain-drop';
        drop.style.left = `${Math.random() * 100}%`;
        drop.style.animationDuration = `${0.4 + Math.random() * 0.3}s`;
        drop.style.animationDelay = `${Math.random() * 2}s`;
        rainContainer.appendChild(drop);
    }
    
    effect.appendChild(rainContainer);
    
    // Ajouter les éclairs
    const stormDiv = document.createElement('div');
    stormDiv.className = 'storm-effect';
    effect.appendChild(stormDiv);
    
    document.body.appendChild(effect);
}

/**
 * Affiche un message d'erreur avec animation
 */
function showError(element, message) {
    element.textContent = message;
    element.style.animation = 'slideIn 0.3s ease';
}

/**
 * Efface les messages d'erreur
 */
function clearError(element) {
    element.textContent = '';
}

/**
 * Affiche le spinner de chargement
 */
function showLoading(show = true) {
    if (show) {
        elements.loadingSpinner.classList.remove('hidden');
        elements.loadingMessage.textContent = 'Chargement...';
    } else {
        elements.loadingSpinner.classList.add('hidden');
        elements.loadingMessage.textContent = '';
    }
}

// =========================================================================
//                          RECHERCHE PAR VILLE
// =========================================================================

async function fetchCityWeather(city) {
    if (!city) return;
    
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=fr`;
    
    // Réinitialisation
    elements.resultSearch.classList.add('hidden');
    clearError(elements.errorSearch);
    elements.searchButton.disabled = true;
    elements.searchButton.textContent = 'Recherche...';
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Ville introuvable. Veuillez vérifier l\'orthographe.');
        }
        
        const data = await response.json();
        displaySearchResult(data);
        updateDynamicStyle(data.weather[0].main);
        
    } catch (error) {
        showError(elements.errorSearch, error.message);
        updateDynamicStyle('clear');
    } finally {
        elements.searchButton.disabled = false;
        elements.searchButton.textContent = 'Rechercher';
    }
}

/**
 * Affiche le résultat de la recherche
 */
function displaySearchResult(data) {
    document.getElementById('city-name-search').textContent = data.name;
    document.getElementById('temperature-search').textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById('description-search').textContent = data.weather[0].description;
    document.getElementById('weather-icon-search').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    
    elements.resultSearch.classList.remove('hidden');
    elements.resultSearch.style.animation = 'fadeIn 0.4s ease';
}

// =========================================================================
//                          GÉOLOCALISATION
// =========================================================================

function handleGeolocation() {
    // Réinitialisation
    clearError(elements.errorGeo);
    elements.currentWeatherGeo.classList.add('hidden');
    elements.forecastSection.classList.add('hidden');
    elements.forecastContainer.innerHTML = '';
    showLoading(true);
    
    if (!navigator.geolocation) {
        showLoading(false);
        showError(elements.errorGeo, 'La géolocalisation n\'est pas supportée par votre navigateur.');
        updateDynamicStyle('clear');
        return;
    }
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            fetchGeoWeather(latitude, longitude);
        },
        (error) => {
            showLoading(false);
            let errorMessage = 'Erreur de géolocalisation. ';
            
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage += 'Vous devez autoriser l\'accès à votre position.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage += 'Position indisponible.';
                    break;
                case error.TIMEOUT:
                    errorMessage += 'La demande a expiré.';
                    break;
                default:
                    errorMessage += 'Une erreur inconnue est survenue.';
            }
            
            showError(elements.errorGeo, errorMessage);
            updateDynamicStyle('clear');
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

async function fetchGeoWeather(lat, lon) {
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=fr`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=fr`;
    
    try {
        const [currentResponse, forecastResponse] = await Promise.all([
            fetch(currentUrl),
            fetch(forecastUrl)
        ]);
        
        if (!currentResponse.ok || !forecastResponse.ok) {
            throw new Error('Impossible de récupérer les données météo.');
        }
        
        const currentData = await currentResponse.json();
        const forecastData = await forecastResponse.json();
        
        showLoading(false);
        displayCurrentGeoWeather(currentData);
        displayFiveDayForecast(forecastData);
        updateDynamicStyle(currentData.weather[0].main);
        
    } catch (error) {
        showLoading(false);
        showError(elements.errorGeo, 'Erreur lors de la récupération des données météo.');
        updateDynamicStyle('clear');
    }
}

/**
 * Affiche la météo actuelle (géolocalisation)
 */
function displayCurrentGeoWeather(data) {
    elements.geoCityName.textContent = `${data.name}`;
    document.getElementById('temperature-geo').textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById('description-geo').textContent = data.weather[0].description;
    document.getElementById('weather-icon-geo').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    
    elements.currentWeatherGeo.classList.remove('hidden');
    elements.currentWeatherGeo.style.animation = 'fadeIn 0.4s ease';
}

/**
 * Affiche les prévisions sur 5 jours
 */
function displayFiveDayForecast(data) {
    elements.forecastContainer.innerHTML = '';
    
    const dailyForecasts = {};
    const today = new Date().toLocaleDateString();
    
    // Filtrer pour obtenir une prévision par jour (vers midi)
    data.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dateText = date.toLocaleDateString();
        const hour = date.getHours();
        
        if (dateText !== today && hour >= 11 && hour <= 14 && !dailyForecasts[dateText]) {
            dailyForecasts[dateText] = item;
        }
    });
    
    // Créer les cartes de prévisions
    Object.values(dailyForecasts).slice(0, 5).forEach((dayData, index) => {
        const date = new Date(dayData.dt * 1000);
        const dateStr = date.toLocaleDateString('fr-FR', { 
            weekday: 'short', 
            day: 'numeric',
            month: 'short'
        });
        
        const temp = Math.round(dayData.main.temp);
        const iconCode = dayData.weather[0].icon;
        const pop = dayData.pop * 100;
        
        // Calcul de l'indice de confiance
        let confidence = 'Élevée';
        if (pop >= 80) {
            confidence = 'Faible';
        } else if (pop >= 60) {
            confidence = 'Moyenne';
        }
        
        const card = document.createElement('div');
        card.classList.add('forecast-card');
        card.style.animation = `fadeIn 0.4s ease ${index * 0.1}s both`;
        card.innerHTML = `
            <h3>${dateStr}</h3>
            <img src="https://openweathermap.org/img/wn/${iconCode}.png" alt="Météo">
            <p class="forecast-temp">${temp}°C</p>
            <p class="confidence-label">Confiance: <span class="confidence-${confidence.toLowerCase()}">${confidence}</span></p>
        `;
        
        elements.forecastContainer.appendChild(card);
    });
    
    if (Object.keys(dailyForecasts).length > 0) {
        elements.forecastSection.classList.remove('hidden');
    }
}

// =========================================================================
//                          ÉVÉNEMENTS
// =========================================================================

// Recherche
elements.searchButton.addEventListener('click', () => {
    const city = elements.cityInput.value.trim();
    fetchCityWeather(city);
});

elements.cityInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const city = elements.cityInput.value.trim();
        fetchCityWeather(city);
    }
});

// Navigation
elements.tabSearch.addEventListener('click', () => switchView('search'));
elements.tabGeo.addEventListener('click', () => switchView('geo'));

// =========================================================================
//                          INITIALISATION
// =========================================================================

document.addEventListener('DOMContentLoaded', () => {
    switchView('search');
    
    // Ajouter les animations CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateX(-10px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
    `;
    document.head.appendChild(style);
});