import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Image,
  Alert,
} from 'react-native';
import { useWeather } from '../contexts/WeatherContext';
import { useLocation } from '../hooks/useLocation';
import WeatherSkeleton from '../components/WeatherSkeleton';

const WeatherScreen: React.FC = () => {
  const { location, locationError, isLoading: locationLoading } = useLocation();
  const {
    weatherData,
    isLoading,
    error,
    lastUpdated,
    fetchWeather,
    refreshWeather,
  } = useWeather();

  useEffect(() => {
    if (location) {
      fetchWeather(location);
    }
  }, [location]);

  useEffect(() => {
    if (locationError) {
      Alert.alert('Location Error', locationError);
    }
  }, [locationError]);

  useEffect(() => {
    if (error) {
      Alert.alert('Weather Error', error);
    }
  }, [error]);

  const onRefresh = (): void => {
    refreshWeather();
    if (location) {
      fetchWeather(location);
    }
  };

  const formatTime = (timestamp: number | null): string => {
    if (!timestamp) return 'Never';
    return new Date(timestamp).toLocaleTimeString();
  };

  if (locationLoading || isLoading) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <WeatherSkeleton />
      </ScrollView>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
      }
    >
      {weatherData ? (
        <>
          <View style={styles.header}>
            <Text style={styles.location}>{weatherData.name}</Text>
            <Text style={styles.temperature}>
              {Math.round(weatherData.main.temp)}°C
            </Text>
            <Text style={styles.description}>
              {weatherData.weather[0].description}
            </Text>
            {weatherData.weather[0].icon && (
              <Image
                style={styles.weatherIcon}
                source={{
                  uri: `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`,
                }}
              />
            )}
          </View>

          <View style={styles.details}>
            <View style={styles.detailCard}>
              <Text style={styles.detailLabel}>Feels Like</Text>
              <Text style={styles.detailValue}>
                {Math.round(weatherData.main.feels_like)}°C
              </Text>
            </View>

            <View style={styles.detailCard}>
              <Text style={styles.detailLabel}>Humidity</Text>
              <Text style={styles.detailValue}>
                {weatherData.main.humidity}%
              </Text>
            </View>

            <View style={styles.detailCard}>
              <Text style={styles.detailLabel}>Wind Speed</Text>
              <Text style={styles.detailValue}>
                {weatherData.wind.speed} m/s
              </Text>
            </View>

            <View style={styles.detailCard}>
              <Text style={styles.detailLabel}>Pressure</Text>
              <Text style={styles.detailValue}>
                {weatherData.main.pressure} hPa
              </Text>
            </View>
          </View>

          <Text style={styles.lastUpdated}>
            Last updated: {formatTime(lastUpdated)}
          </Text>
        </>
      ) : (
        <Text style={styles.errorText}>No weather data available</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  location: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  description: {
    fontSize: 18,
    color: '#666',
    textTransform: 'capitalize',
    marginBottom: 10,
  },
  weatherIcon: {
    width: 100,
    height: 100,
  },
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailCard: {
    width: '48%',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  lastUpdated: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
    fontSize: 12,
  },
  errorText: {
    textAlign: 'center',
    color: '#FF3B30',
    fontSize: 16,
    marginTop: 20,
  },
});

export default WeatherScreen;
