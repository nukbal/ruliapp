import { combineReducers } from 'redux';
import loadingReducer from './ducks/loading';
import boardsReducer from './ducks/boards';

export default function createReducer(injectedReducers) {
  return combineReducers({
    loading: loadingReducer,
    boards: boardsReducer,
  });
}
