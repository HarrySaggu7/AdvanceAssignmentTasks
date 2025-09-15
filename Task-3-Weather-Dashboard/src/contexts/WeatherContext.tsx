import React, { createContext, useContext, useState, ReactNode } from 'react';
import { WeatherData, Location, WeatherContextType } from '../types/weather';
import {
  getWeatherByCoords,
  getMockWeatherData,
} from '../services/weatherService';

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

interface WeatherProviderProps {
  children: ReactNode;
}

export const WeatherProvider: React.FC<WeatherProviderProps> = ({
  children,
}) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  const fetchWeather = async (location: Location): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // To check if we have cached data that's less than 15 minutes old
      const now = Date.now();
      if (weatherData && lastUpdated && now - lastUpdated < 15 * 60 * 1000) {
        setIsLoading(false);
        return;
      }

      let data: WeatherData;

      try {
        data = await getWeatherByCoords(location);
      } catch (apiError) {
        console.warn('Using mock data due to API error:', apiError);
        data = getMockWeatherData();
      }

      setWeatherData(data);
      setLastUpdated(now);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch weather data');
      console.error('Weather fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshWeather = (): void => {
    if (weatherData) {
      setLastUpdated(Date.now());
    }
  };

  const value: WeatherContextType = {
    weatherData,
    isLoading,
    error,
    lastUpdated,
    fetchWeather,
    refreshWeather,
  };

  return (
    <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>
  );
};

export const useWeather = (): WeatherContextType => {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};
