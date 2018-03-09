import { combineReducers } from 'redux';
import loadingReducer from './ducks/loading';
import boardsReducer from './ducks/boards';
import detailReducer from './ducks/detail';
import routerReducer from './ducks/router';
import cacheRouter from './ducks/cache';

export default function createReducer(injectedReducers) {
  return combineReducers({
    router: routerReducer,
    loading: loadingReducer,
    boards: boardsReducer,
    detail: detailReducer,
    cache: cacheRouter,
  });
}
