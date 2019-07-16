import React, { useEffect } from 'react';
import { createAppContainer } from 'react-navigation';
import { ThemeProvider } from 'styled-components/native';
import AsyncStorage from '@react-native-community/async-storage';
import lightTheme from './styles/light';
import darkTheme from './styles/dark';
import MainRouter from './pages';

const Container = createAppContainer(MainRouter);

export default function App() {
  const theme = darkTheme;

  useEffect(() => {
    AsyncStorage.getAllKeys((err, keys) => {
      if (err) return;
      if (keys) {
        AsyncStorage
          .multiRemove(keys.filter(key => key.indexOf('@Post') > -1))
      }
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Container screenProps={{ theme }} />
    </ThemeProvider>
  );
}
