import React from 'react';
import { Provider } from 'react-redux';
import { NavigationNativeContainer } from '@react-navigation/native';
import { PersistGate } from 'redux-persist/integration/react';
import MainRouter from './pages';
import createStores from './store';

export default function App() {
  const { store, persistor } = createStores();
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
