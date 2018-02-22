import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

import rootSaga from './sagas';
import createReducer from './reducers';

const sagaMiddleware = createSagaMiddleware();

export default function createStores(initialState = {}) {
  const middlewares = [
    sagaMiddleware,
  ];

  const store = createStore(
    createReducer(),
    initialState,
    compose(
      applyMiddleware(...middlewares),
    ),
  );

  sagaMiddleware.run(rootSaga);

  store.runSaga = sagaMiddleware.run;
  store.asyncReducers = {};
  store.asyncSagas = {};

  return store;
}
