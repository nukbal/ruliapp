import { all } from 'redux-saga/effects';
import { boardSagas } from './ducks/boards';
import { postSagas } from './ducks/posts';

export default function* rootSaga() {
  yield all([
    ...boardSagas,
    ...postSagas,
  ]);
}
