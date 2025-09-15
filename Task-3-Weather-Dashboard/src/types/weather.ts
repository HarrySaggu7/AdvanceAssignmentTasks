export interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: [
    {
      main: string;
      description: string;
      icon: string;
    }
  ];
  wind: {
    speed: number;
  };
  dt: number;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface WeatherContextType {
  weatherData: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
  fetchWeather: (location: Location) => Promise<void>;
  refreshWeather: () => void;
}