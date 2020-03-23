/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react-native';
import { store } from './stores';


export function renderApp(ui: any) {
  return render((
    <Provider store={store}>
      {ui}
    </Provider>
  ));
}

export * from '@testing-library/react-native';
