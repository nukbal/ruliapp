import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers';

import rootSaga from './sagas';
import createReducer from './reducers';

const sagaMiddleware = createSagaMiddleware();

const routerMiddleware = createReactNavigationReduxMiddleware(
  "root",
  state => state.router,
);

export default function createStores(initialState = {}) {
  const middlewares = [
    sagaMiddleware,
    routerMiddleware,
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
