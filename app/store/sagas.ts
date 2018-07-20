import { all } from 'redux-saga/effects';
import { boardSagas } from './ducks/boards';
import { detailSaga } from './ducks/detail';

export default function* rootSaga() {
  yield all([
    ...boardSagas,
    ...detailSaga,
  ]);
}
