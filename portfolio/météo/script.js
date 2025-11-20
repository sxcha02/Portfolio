// REMPLACER CECI PAR VOTRE CLÉ API OPENWEATHERMAP
const API_KEY = 'c4e92ab59bf6ec41660f726557582461'; 
// --- Éléments du DOM pour la Navigation et les Vues ---
const tabSearch = document.getElementById('tab-search');
const tabGeo = document.getElementById('tab-geo');
const viewSearch = document.getElementById('view-search');
const viewGeo = document.getElementById('view-geo');
const appContainer = document.getElementById('app-container');

// --- Éléments de la Vue Recherche ---
const cityInput = document.getElementById('city-input');
const searchButton = document.getElementById('search-button');
const resultSearch = document.getElementById('weather-result-search');
const errorSearch = document.getElementById('error-message-search');

// --- Éléments de la Vue Géolocalisation ---
const loadingMessage = document.getElementById('loading-message');
const errorGeo = document.getElementById('error-message-geo');
const geoCityName = document.getElementById('geo-city-name');
const currentWeatherGeo = document.getElementById('current-weather-geo');
const forecastTitle = document.getElementById('forecast-title');
const forecastContainer = document.getElementById('forecast-5-days');


// =========================================================================
//                             FONCTIONS DE BASE
// =========================================================================

/**
 * Change la vue et l'onglet actif.
 * @param {string} viewId - 'search' ou 'geo'.
 */
function switchView(viewId) {
    // 1. Masquer tout
    viewSearch.classList.add('hidden');
    viewGeo.classList.add('hidden');
    tabSearch.classList.remove('active');
    tabGeo.classList.remove('active');

    // 2. Afficher la vue demandée
    if (viewId === 'search') {
        viewSearch.classList.remove('hidden');
        tabSearch.classList.add('active');
    } else if (viewId === 'geo') {
        viewGeo.classList.remove('hidden');
        tabGeo.classList.add('active');
        // Lancement de la géolocalisation
        handleGeolocation(); 
    }
}

/**
 * Met à jour le style de l'app en fonction de la condition météo principale.
 * @param {string} condition - La condition météo (ex: 'Rain', 'Clear', 'Clouds').
 */
function updateDynamicStyle(condition) {
    // Réinitialiser les classes
    appContainer.className = 'app-container'; 
    appContainer.classList.add('transition-bg'); // Garder la classe pour la transition

    // Mapper la condition à une classe CSS
    const lowerCondition = condition.toLowerCase();
    
    if (lowerCondition.includes('clear')) {
        appContainer.classList.add('weather-clear');
    } else if (lowerCondition.includes('cloud')) {
        appContainer.classList.add('weather-clouds');
    } else if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) {
        appContainer.classList.add('weather-rain');
    } else if (lowerCondition.includes('storm')) {
        appContainer.classList.add('weather-storm');
    } else if (lowerCondition.includes('snow')) {
        appContainer.classList.add('weather-snow');
    }
}


// =========================================================================
//                           RECHERCHE PAR VILLE
// =========================================================================

async function fetchCityWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=fr`;
    
    // Réinitialisation de l'affichage
    resultSearch.classList.add('hidden');
    errorSearch.textContent = '';
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Ville non trouvée. Veuillez vérifier l\'orthographe.');
        }

        const data = await response.json();
        
        // Mise à jour de la carte de recherche
        document.getElementById('city-name-search').textContent = data.name;
        document.getElementById('temperature-search').textContent = `${Math.round(data.main.temp)}°C`;
        document.getElementById('description-search').textContent = data.weather[0].description;
        document.getElementById('weather-icon-search').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        
        resultSearch.classList.remove('hidden');
        updateDynamicStyle(data.weather[0].main); // Appliquer le style dynamique
        
    } catch (error) {
        errorSearch.textContent = error.message;
        updateDynamicStyle('clear'); // Revenir au style par défaut
    }
}

// Gérer le clic et la touche Entrée pour la recherche
searchButton.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchCityWeather(city);
    }
});

cityInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Empêche l'envoi de formulaire si l'input était dans un form
        const city = cityInput.value.trim();
        if (city) {
            fetchCityWeather(city);
        }
    }
});


// =========================================================================
//                         GÉOLOCALISATION & PRÉVISIONS
// =========================================================================

function handleGeolocation() {
    loadingMessage.textContent = 'Chargement de la météo...';
    errorGeo.textContent = '';
    currentWeatherGeo.classList.add('hidden');
    forecastTitle.classList.add('hidden');
    forecastContainer.innerHTML = ''; // Vider les anciennes prévisions

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                loadingMessage.textContent = 'Position trouvée, récupération des données...';
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                fetchGeoWeather(lat, lon);
            },
            (error) => {
                loadingMessage.textContent = '';
                errorGeo.textContent = "Géolocalisation refusée ou indisponible. Veuillez utiliser la recherche par ville.";
                updateDynamicStyle('clear');
            }
        );
    } else {
        loadingMessage.textContent = '';
        errorGeo.textContent = "Votre navigateur ne supporte pas la géolocalisation.";
        updateDynamicStyle('clear');
    }
}

async function fetchGeoWeather(lat, lon) {
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=fr`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=fr`;

    try {
        const [currentResponse, forecastResponse] = await Promise.all([
            fetch(currentUrl),
            fetch(forecastUrl)
        ]);

        const currentData = await currentResponse.json();
        const forecastData = await forecastResponse.json();

        loadingMessage.textContent = '';
        
        // 1. Afficher la météo actuelle
        displayCurrentGeoWeather(currentData);

        // 2. Afficher les prévisions
        displayFiveDayForecast(forecastData);

    } catch (error) {
        loadingMessage.textContent = '';
        errorGeo.textContent = "Erreur lors de la récupération des données météo.";
        updateDynamicStyle('clear');
    }
}

function displayCurrentGeoWeather(data) {
    geoCityName.textContent = `Météo Actuelle à ${data.name}`;
    document.getElementById('temperature-geo').textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById('description-geo').textContent = data.weather[0].description;
    document.getElementById('weather-icon-geo').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    
    currentWeatherGeo.classList.remove('hidden');
    updateDynamicStyle(data.weather[0].main); // Appliquer le style dynamique
}


function displayFiveDayForecast(data) {
    forecastContainer.innerHTML = '';
    const dailyForecasts = {};
    const today = new Date().toLocaleDateString();

    // Filtre pour ne garder qu'une prévision par jour (vers 12h00)
    data.list.forEach(item => {
        const dateText = new Date(item.dt * 1000).toLocaleDateString();
        const timeHour = new Date(item.dt * 1000).getHours();
        
        // Assure que nous prenons une prévision pour demain ou plus tard
        if (dateText !== today && timeHour >= 11 && timeHour <= 14 && !dailyForecasts[dateText]) {
            dailyForecasts[dateText] = item;
        }
    });

    Object.values(dailyForecasts).slice(0, 5).forEach(dayData => {
        const date = new Date(dayData.dt * 1000).toLocaleDateString('fr-FR', { weekday: 'short', month: 'numeric', day: 'numeric' });
        const temp = Math.round(dayData.main.temp);
        const iconCode = dayData.weather[0].icon;

        // Logique d'Indice de Confiance (Simulée basée sur Probabilité de Précipitation - PoP)
        const pop = dayData.pop * 100; 
        let confidence = 'Élevée';
        
        if (pop >= 60) {
             confidence = 'Moyenne'; // Forte chance de pluie = incertitude sur l'évolution
        } else if (pop >= 80) {
             confidence = 'Faible'; 
        }

        const card = document.createElement('div');
        card.classList.add('forecast-card');
        card.innerHTML = `
            <h3>${date}</h3>
            <img src="https://openweathermap.org/img/wn/${iconCode}.png" alt="Météo">
            <p class="forecast-temp">${temp}°C</p>
            <p class="confidence-label">Confiance: <span class="confidence-${confidence.toLowerCase()}">${confidence}</span></p>
        `;
        forecastContainer.appendChild(card);
    });

    if (Object.keys(dailyForecasts).length > 0) {
        forecastTitle.classList.remove('hidden');
    }
}


// =========================================================================
//                             INITIALISATION
// =========================================================================

// Initialise la première vue
document.addEventListener('DOMContentLoaded', () => {
    switchView('search');
    
    // Gérer les clics sur les onglets
    tabSearch.addEventListener('click', () => switchView('search'));
    tabGeo.addEventListener('click', () => switchView('geo'));
});