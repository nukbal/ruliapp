import React, { Children, createContext, useState } from 'react';
import lightTheme from './styles/light';
import darkTheme from './styles/dark';

interface ThemeContext {
  theme: Readonly<{
    primary: string;
    background: string;
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

  const toggleTheme = () => setDarkMode(!isDark);
  const theme = isDark ? darkTheme : lightTheme;
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
      {Children.only(children)}
    </ThemeContext.Provider>
  );
}

export default ThemeContext;
