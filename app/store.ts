import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { persistStore, persistReducer, PersistConfig } from 'redux-persist';
import AsyncStorage from './utils/persistStorage';
import rootReducer from './stores';

const persistConfig: PersistConfig<any> = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['post'],
  debug: __DEV__,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: ['persist/PERSIST'],
    },
    thunk: true,
  }),
});
export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
