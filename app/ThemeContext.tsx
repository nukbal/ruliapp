import React, { Children, createContext, useState, useCallback, useEffect } from 'react';
import { Platform, StatusBar } from 'react-native';
import theme from './styles';

type themeMode = 'black' | 'dark' | 'light' | 'white';
interface ColorType {
  400: string;
  500: string;
  600: string;
  700: string;
}

interface GrayType extends ColorType {
  50: string;
  75: string;
  100: string;
  200: string;
  300: string;
  800: string;
  900: string;
}

interface ThemeContext {
  theme: Readonly<{
    primary: ColorType;
    gray: GrayType;
    red: ColorType;
  }>;
  mode: themeMode;
  setThemeMode: (mode: themeMode) => void;
}

// @ts-ignore
const ThemeContext = createContext<ThemeContext>({});

export function ThemeProvider({ children }: any) {
  const [mode, setMode] = useState<themeMode>('black');

  useEffect(() => {
    if (Platform.OS === 'ios') {
      StatusBar.setBarStyle(['black', 'dark'].indexOf(mode) > -1 ? 'light-content' : 'dark-content');
    }
  }, [mode]);

  const setThemeMode = useCallback((str: themeMode) => setMode(str), []);
  return (
    <ThemeContext.Provider value={{ theme: theme[mode], setThemeMode, mode }}>
      {Children.only(children)}
    </ThemeContext.Provider>
  );
}

export default ThemeContext;
