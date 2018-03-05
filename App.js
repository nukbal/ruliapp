import React from 'react';
import { Provider } from 'react-redux';
import createStores from './src/store';
import Router from './src';

let initialState = {};
const store = createStores(initialState);

export default function App() {
  return (
    <Provider store={store} >
      <Router />
    </Provider>
  );
}
