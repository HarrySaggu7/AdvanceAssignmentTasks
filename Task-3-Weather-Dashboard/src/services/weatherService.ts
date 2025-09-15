import axios from 'axios';
import { WeatherData, Location } from '../types/weather';

const API_KEY = 'a25e42bca40f02946cef8b43fb29f514'; // Get from https://home.openweathermap.org/api_keys
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const getWeatherByCoords = async (location: Location): Promise<WeatherData> => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat: location.latitude,
        lon: location.longitude,
        appid: API_KEY,
        units: 'metric', // metric for Celsius
      },
    });

    return response.data;
  } catch (error) {
    console.error('Weather API error:', error);
    throw new Error('Failed to fetch weather data');
  }
};

// Fallback mock data for development
export const getMockWeatherData = (): WeatherData => ({
  name: 'London',
  main: {
    temp: 15.5,
    feels_like: 14.8,
    humidity: 65,
    pressure: 1012,
  },
  weather: [
    {
      main: 'Clouds',
      description: 'scattered clouds',
      icon: '03d',
    },
  ],
  wind: {
    speed: 3.6,
  },
  dt: Date.now() / 1000,
});