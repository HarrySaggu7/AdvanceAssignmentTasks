// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WeatherProvider } from './src/contexts/WeatherContext';
import WeatherScreen from './src/screens/WeatherScreen';

export type RootStackParamList = {
  Weather: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  return (
    <WeatherProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Weather"
            component={WeatherScreen}
            options={{ title: 'Weather Dashboard' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </WeatherProvider>
  );
}

export default App;
