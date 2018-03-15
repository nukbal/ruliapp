import { all } from 'redux-saga/effects';
import { boardSagas } from './ducks/boards';
import { detailSaga } from './ducks/detail';
import { cacheSaga } from './ducks/cache';

export default function* rootSaga() {
  yield all([
    ...boardSagas,
    ...detailSaga,
    ...cacheSaga,
  ]);
}
