import React, { useEffect, useState } from 'react';
import { createAppContainer } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import { ThemeProvider } from './ThemeContext';
import MainRouter from './pages';

const Container = createAppContainer(MainRouter);

export default function App() {
  useEffect(() => {
    AsyncStorage.getAllKeys((err, keys) => {
      if (err) return;
      if (keys) {
        AsyncStorage
          .multiRemove(keys.filter((key) => key.indexOf('@Post') > -1));
      }
    });
  }, []);

  return (
    <ThemeProvider>
      <Container />
    </ThemeProvider>
  );
}
