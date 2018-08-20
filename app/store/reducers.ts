import { combineReducers } from 'redux';
import boardsReducer from './ducks/boards';
import postReducer from './ducks/posts';
import commentReducer from './ducks/comments';

// @ts-ignore
export default combineReducers({
  boards: boardsReducer,
  posts: postReducer,
  comments: commentReducer,
});
