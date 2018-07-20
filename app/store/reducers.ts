import { combineReducers } from 'redux';
import loadingReducer from './ducks/loading';
import boardsReducer from './ducks/boards';
import detailReducer from './ducks/detail';

export default combineReducers({
  loading: loadingReducer,
  boards: boardsReducer,
  detail: detailReducer,
});