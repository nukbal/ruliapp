import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { ThemeProvider } from './ThemeContext';
import { AuthProvider } from './AuthContext';
import MainRouter from './pages';

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
      <AuthProvider>
        <MainRouter />
      </AuthProvider>
    </ThemeProvider>
  );
}
