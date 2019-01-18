import { applyMiddleware, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';
import { rootReducer as reducer, rootSaga } from './stores';

export default function createStores() {
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
  sagaMiddleware.run(rootSaga);

  return store;
}
