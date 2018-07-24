import { combineReducers } from 'redux';
import loadingReducer from './ducks/loading';
import boardsReducer from './ducks/boards';
import detailReducer from './ducks/detail';
import commentReducer from './ducks/comments';

export default combineReducers({
  loading: loadingReducer,
  boards: boardsReducer,
  detail: detailReducer,
  comments: commentReducer,
});
