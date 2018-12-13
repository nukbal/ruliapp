import { put, call, takeLatest } from 'redux-saga/effects';
import { createSelector } from 'reselect';
import { Alert, Platform } from 'react-native';
import { Actions as BoardAction } from './boards';
import { createAction, ActionsUnion } from './helpers';
import parsePost from '../utils/parsePost';

/* Actions */
const REQUEST = 'post/REQUEST';
const ADD = 'post/ADD';
const BUMP = 'post/BUMP';
const REMOVE = 'post/REMOVE';

export const Actions = {
  request: (prefix: string, boardId: string, id: string) =>
    createAction(REQUEST, { prefix, boardId, id }),

  add: (payload: any) => createAction(ADD, payload),
  bump: (key: string, rows: any[]) => createAction(BUMP, { key, rows }),
  remove: (key: string) => createAction(REMOVE, key),
};
export type Actions = ActionsUnion<typeof Actions>;

/* Selectors */

export const getPosts = (state: any): DetailState => state.posts;

export const getPostInfo = createSelector(
  [getPosts],
  detail => detail,
);

/* Sagas */

export function* requestDetailSaga({ payload }: ReturnType<typeof Actions.request>) {
  const { prefix, boardId, id } = payload;
  const key = `${prefix}_${boardId}_${id}`;

  try {
    const targetUrl =
      `http://m.ruliweb.com/${prefix}/board/${boardId}/read/${id}?search_type=name&search_key=%2F%2F%2F`;
    const config = {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'text/html',
        'Content-Type': 'text/html',
        'Accept-Encoding': 'gzip, deflate',
        Referer: targetUrl,
      },
    };

    if (Platform.OS === 'android') {
      delete config.headers['Accept-Encoding'];
    }

    // @ts-ignore
    const response = yield call(fetch, targetUrl, config);
    const htmlString = yield response.text();
    const json = yield call(parsePost, htmlString, key);
    yield put(Actions.add(json));

  } catch (e) {
    console.warn(e.message);
    yield put(BoardAction.remove(key));
    Alert.alert('error', '해당 글이 존재하지 않습니다.');
  }
}

export const postSagas = [
  takeLatest(REQUEST, requestDetailSaga),
];

/* Reducer */

export interface DetailState {
  readonly records: Readonly<{
    [key: string]: PostRecord,
  }>;
  readonly loading: boolean;
}

const initState: DetailState = { records: {}, loading: false };

export default function reducer(state = initState, action: Actions) {
  switch (action.type) {
    case REQUEST: {
      return { ...state, loading: true };
    }
    case BUMP: {
      const { key, rows } = action.payload;
      const records = Object.assign(state.records[key] || {}, rows);
      return { records: { ...state.records, [key]: records }, loading: false };
    }
    case ADD: {
      return { record: { ...state.records, ...action.payload }, loading: false };
    }
    default:
      return state;
  }
}