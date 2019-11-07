import React, { Children, createContext, useState, useCallback, useEffect } from 'react';
import { Platform, StatusBar } from 'react-native';
import lightTheme from './styles/light';
import darkTheme from './styles/dark';

interface ThemeContext {
  theme: Readonly<{
    primary: string;
    primaryHover: string;
    background: string;
    backgroundLight: string;
    backgroundSub: string;
    text: string;
    label: string;
    border: string;
  }>;
  isDark: boolean;
  toggleTheme: () => void;
}

// @ts-ignore
const ThemeContext = createContext<ThemeContext>({});

export function ThemeProvider({ children }: any) {
  const [isDark, setDarkMode] = useState(true);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content');
    }
  }, [isDark]);

  const toggleTheme = useCallback(() => setDarkMode(!isDark), [isDark]);
  const theme = isDark ? darkTheme : lightTheme;
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
      {Children.only(children)}
    </ThemeContext.Provider>
  );
}

export default ThemeContext;
