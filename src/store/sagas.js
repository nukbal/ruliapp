import { all } from 'redux-saga/effects';
import { boardSagas } from './ducks/boards';

export default function* rootSaga() {
  yield all([
    ...boardSagas,
  ]);
}
