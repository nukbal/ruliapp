import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects';

import boardReducer, { boardSagas } from './boards';
import postReducer, { postSagas } from './posts';

export function* rootSaga() {
  yield all([
    ...boardSagas,
    ...postSagas,
  ]);
}


export const rootReducer = combineReducers({
  // @ts-ignore
  board: boardReducer,
  // @ts-ignore
  post: postReducer,
});
