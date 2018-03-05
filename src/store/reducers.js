import { combineReducers } from 'redux';
import loadingReducer from './ducks/loading';
import boardsReducer from './ducks/boards';
import detailReducer from './ducks/detail';
import routerReducer from './ducks/router';

export default function createReducer(injectedReducers) {
  return combineReducers({
    router: routerReducer,
    loading: loadingReducer,
    boards: boardsReducer,
    detail: detailReducer,
  });
}
