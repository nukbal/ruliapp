import { combineReducers } from 'redux';
import userReducer from './user';
import themeReducer from './theme';
import postReducer from './post';

export default combineReducers({
  user: userReducer,
  theme: themeReducer,
  post: postReducer,
});
