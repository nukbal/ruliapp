import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { readDir, unlink, exists } from 'react-native-fs';

import { CACHE_PATH } from './config/constants';

import MainRouter from './pages';
import { store, persistor } from './stores';

const CACHE_LIMIT_TIME = 86400000;

export default function App() {

  useEffect(() => {
    const now = Date.now();
    async function clearCache() {
      const isExists = await exists(CACHE_PATH);
      if (!isExists) return;
      const cache = await readDir(CACHE_PATH);
      await Promise.all(cache.map((file) => {
        if (now - (file.mtime?.getTime() ?? 0) > CACHE_LIMIT_TIME) {
          return unlink(file.path);
        }
        return null;
      }).filter(Boolean));
    }
    clearCache();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <MainRouter />
      </PersistGate>
    </Provider>
  );
}
