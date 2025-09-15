import { useState, useEffect } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { Location } from '../types/weather';

export const useLocation = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = (): void => {
    setIsLoading(true);
    
    // Configure location options
    const locationOptions = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 10000
    };

    if (Platform.OS === 'android') {
      // For Android, request permission first
      requestAndroidPermission();
    } else {
      // For iOS, directly get location
      requestIOSLocation();
    }
  };

  const requestAndroidPermission = async (): Promise<void> => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location to show weather data',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getLocation();
      } else {
        handleLocationError('Location permission denied');
      }
    } catch (error: any) {
      handleLocationError(error.message);
    }
  };

  const requestIOSLocation = (): void => {
    // iOS handles permissions differently - we'll try to get location
    // and if it fails, use the fallback
    getLocation();
  };

  const getLocation = (): void => {
    Geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationError(null);
        setIsLoading(false);
      },
      (error) => {
        handleLocationError(error.message);
      },
      { 
        enableHighAccuracy: true, 
        timeout: 15000, 
        maximumAge: 10000 
      }
    );
  };

  const handleLocationError = (error: string): void => {
    console.warn('Location error, using fallback:', error);
    setLocationError(error);
    setIsLoading(false);
    
    // Fallback to London coordinates
    setLocation({
      latitude: 51.5074,
      longitude: -0.1278,
    });
  };

  return {
    location,
    locationError,
    isLoading,
    refreshLocation: getCurrentLocation,
  };
};