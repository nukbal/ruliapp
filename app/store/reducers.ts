import { combineReducers } from 'redux';
import boardsReducer from './ducks/boards';
import detailReducer from './ducks/detail';
import commentReducer from './ducks/comments';

export default combineReducers({
  boards: boardsReducer,
  detail: detailReducer,
  comments: commentReducer,
});
