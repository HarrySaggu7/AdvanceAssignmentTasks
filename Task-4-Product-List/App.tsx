import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import ProductListScreen from './src/screens/ProductListScreen';

const App: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ProductListScreen />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
