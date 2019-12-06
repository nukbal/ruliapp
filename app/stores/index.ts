import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './user';
import themeReducer from './theme';
import postReducer from './post';
import bookmarkReducer from './bookmark';

const rootReducer = combineReducers({
  user: userReducer,
  theme: themeReducer,
  post: postReducer,
  bookmark: bookmarkReducer,
});
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
