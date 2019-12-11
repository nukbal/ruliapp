import React from 'react';
import { Provider } from 'react-redux';
import { NavigationNativeContainer } from '@react-navigation/native';
import MainRouter from './pages';
import { store } from './store';
import './initialize';

export default function App() {
  return (
    <Provider store={store}>
      <NavigationNativeContainer>
        <MainRouter />
      </NavigationNativeContainer>
    </Provider>
  );
}
