import { takeLatest } from 'redux-saga/effects';

export const actionType = {
  REQUEST_LIST_INFO: 'REQUEST_LIST_INFO',
  REQUEST_LIST_INFO_DONE: 'REQUEST_LIST_INFO_DONE',
};

export function* requestListInfoSaga({ payload }) {
  
}

export function* watcher() {
  yield takeLatest(actionType.REQUEST_LIST_INFO);
}
