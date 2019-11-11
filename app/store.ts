import { createStore } from 'redux';
import { persistStore, persistReducer, PersistConfig } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import rootReducer from './stores';

const persistConfig: PersistConfig<any> = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['post'],
  debug: __DEV__,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

export default function createStores() {
  const store = createStore(persistedReducer);
  const persistor = persistStore(store);
  return { store, persistor };
}
