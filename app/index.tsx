import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { NavigationNativeContainer } from '@react-navigation/native';
import MainRouter from './pages';
import { store, persistor } from './stores';

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationNativeContainer>
          <MainRouter />
        </NavigationNativeContainer>
      </PersistGate>
    </Provider>
  );
}
