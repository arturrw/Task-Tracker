const axios = require('axios');
require('dotenv').config();

const apiKey = process.env.WEATHER_API_KEY;
const baseUrl = process.env.WEATHER_API_BASE_URL || 'https://api.openweathermap.org/data/2.5/weather';

async function getCityWeather(cityName) {
  if (!apiKey) {
    throw new Error('Weather API key is missing');
  }

  if (!cityName) {
    throw new Error('City name is missing');
  }

  const response = await axios.get(baseUrl, {
    params: {
      q: cityName,
      appid: apiKey,
      units: 'metric'
    }
  });

  const data = response.data;

  const temperature =
    data.main && data.main.temp != null ? Math.round(data.main.temp) : null;

  const feelsLike =
    data.main && data.main.feels_like != null ? Math.round(data.main.feels_like) : null;

  const description =
    data.weather && data.weather[0] && data.weather[0].description
      ? data.weather[0].description
      : 'No description';

  return {
    city: data.name || cityName,
    temperature,
    feelsLike,
    description
  };
}

module.exports = {
  getCityWeather
};
