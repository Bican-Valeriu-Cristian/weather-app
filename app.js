import { CONFIG } from './modules/config.js';
import { getWeatherByCoords } from './modules/weather-service.js';
import { getCoords } from './modules/location-service.js';
import {
  getElements,
  displayWeather,
  showMessage,
  saveUserPreferences,
  loadUserPreferences,
} from './modules/ui-controller.js';

const elements = getElements();

// Load and apply preferences
const prefs = loadUserPreferences();
CONFIG.DEFAULT_UNITS = prefs.unit;
CONFIG.DEFAULT_LANG = prefs.lang;
elements.unitSelect.value = prefs.unit;
elements.langSelect.value = prefs.lang;

// Event listeners
elements.unitSelect.addEventListener('change', async (e) => {
  CONFIG.DEFAULT_UNITS = e.target.value;
  saveUserPreferences(e.target.value, CONFIG.DEFAULT_LANG);
  loadWeather();
});

elements.langSelect.addEventListener('change', async (e) => {
  CONFIG.DEFAULT_LANG = e.target.value;
  saveUserPreferences(CONFIG.DEFAULT_UNITS, e.target.value);
  loadWeather();
});

const loadWeather = async () => {
  showMessage(elements, 'Determin locația...');
  try {
    const coords = await getCoords();
    showMessage(elements, 'Încarc vremea...');
    const weather = await getWeatherByCoords(coords.latitude, coords.longitude);
    displayWeather(elements, weather);
    showMessage(elements, coords.source === 'gps' ? '' : 'Locație aproximativă (IP)');
  } catch (err) {
    showMessage(elements, `Eroare: ${err.message}`);
  }
};

// Start
loadWeather();
