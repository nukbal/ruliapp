import React from 'react';
import { createAppContainer } from 'react-navigation';
import { ThemeProvider } from 'styled-components/native';
import lightTheme from './styles/light';
import darkTheme from './styles/dark';
import MainRouter from './pages';

const Container = createAppContainer(MainRouter);

export default function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <Container />
    </ThemeProvider>
  );
}
