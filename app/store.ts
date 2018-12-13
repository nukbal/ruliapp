import { applyMiddleware, createStore } from 'redux';
import { persistStore, persistReducer, PersistConfig } from 'redux-persist';
import createSagaMiddleware from 'redux-saga';
import storage from 'redux-persist/lib/storage'
import { composeWithDevTools } from 'redux-devtools-extension';

import { rootReducer, rootSaga } from './stores';

export default function createStores() {
  const persistConfig: PersistConfig = {
    key: 'root',
    blacklist: ['navigation'],
    storage,
  };

  const reducer = persistReducer(persistConfig, rootReducer);

  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [
    sagaMiddleware,
  ];
  const enhancers = composeWithDevTools(applyMiddleware(...middlewares));
  const store = createStore(reducer, enhancers);

  if (__DEV__) {
    if ((module as any).hot) {
      ;(module as any).hot.accept(() => {
        store.replaceReducer(reducer)
      })
    }
  }
  const persistor = persistStore(store);
  sagaMiddleware.run(rootSaga);

  return { store, persistor };
}
