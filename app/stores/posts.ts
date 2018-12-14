import { put, call, takeLatest } from 'redux-saga/effects';
import { createSelector } from 'reselect';
import { Alert, Platform } from 'react-native';
import { Actions as BoardAction } from './boards';
import { createAction, ActionsUnion } from './helpers';
import parsePost from '../utils/parsePost';
import parseComment from '../utils/parseComment';

/* Actions */
const REQUEST = 'post/REQUEST';
const ADD = 'post/ADD';
const BUMP = 'post/BUMP';
const REMOVE = 'post/REMOVE';

const REQUEST_COMMENT = 'post/REQUEST_COMMENT';
const UPDATE_COMMENT = 'post/UPDATE_COMMENT';

export const Actions = {
  request: (payload: { key: string, url: string, parent: string }) =>
    createAction(REQUEST, payload),

  add: (payload: PostRecord) => createAction(ADD, payload),
  bump: (key: string, rows: any[]) => createAction(BUMP, { key, rows }),
  remove: (parent: string, key: string) => createAction(REMOVE, { parent, key }),

  requestComment: (payload: { key: string, url: string, parent: string }) =>
    createAction(REQUEST_COMMENT, payload),
  updateComment: (payload: { key: string, url: string, parent: string, comments: CommentRecord[] }) =>
    createAction(UPDATE_COMMENT, payload),
};
export type Actions = ActionsUnion<typeof Actions>;

/* Selectors */

export const getPosts = (state: any): PostState => state.post;

export const getPostRecords = createSelector(
  [getPosts],
  posts => posts.records,
);

export const isPostLoading = createSelector([getPosts], posts => posts.loading);
export const isCommentLoading = createSelector([getPosts], posts => posts.commentLoading);

export const getPostRecordsByParent = (parent: string) => createSelector(
  [getPostRecords], records => records[parent] || {},
);

export const getPostRecordsByKey = (parent: string, key: string) => createSelector(
  [getPostRecordsByParent(parent)], records => records[key],
);

/* Sagas */

export function* requestDetailSaga({ payload }: ReturnType<typeof Actions.request>) {
  const { key, parent, url } = payload;

  try {
    const targetUrl =
      `http://m.ruliweb.com/${url}?search_type=name&search_key=%2F%2F%2F`;
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
    const json = yield call(parsePost, htmlString, '');
    yield put(Actions.add({ ...json, key, parent }));
  } catch (e) {
    console.warn(e.message);
    yield put(BoardAction.remove(key));
    yield put(Actions.remove(parent, key));
    Alert.alert('error', '해당 글이 존재하지 않습니다.');
  }
}

export function* requestComments({ payload }: ReturnType<typeof Actions.updateComment>) {
  const { key, parent, url } = payload;
  const boardId = url.substring(url.indexOf('board/') + 6, url.indexOf('/read'));
  
  const form = new FormData();
  form.append('page', 1);
  form.append('article_id', key);
  form.append('board_id', boardId);
  form.append('cmtimg', 1);

  const config = {
    method: 'POST',
    body: form,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept-Encoding': 'gzip, deflate',
      referer: `http://m.ruliweb.com/${url}`,
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
    }
  };
  try {
    // @ts-ignore
    const response = yield call(fetch, 'http://api.ruliweb.com/commentView', config);
    const json = yield response.json();
  
    if (!json.success) {
      return null;
    }
    const comments = yield call(parseComment, json.view);
    yield put(Actions.updateComment({ ...payload, comments }));
  } catch(e) {
    return null;
  }
}

export const postSagas = [
  takeLatest(REQUEST, requestDetailSaga),
  takeLatest(REQUEST_COMMENT, requestComments),
];

/* Reducer */

export interface PostState {
  readonly records: Readonly<{
    [key: string]: Readonly<{
      [item: string]: PostRecord;
    }>;
  }>;
  readonly loading: boolean;
  readonly commentLoading: boolean;
}

const initState: PostState = { records: {}, loading: false, commentLoading: false };

export default function reducer(state = initState, action: Actions) {
  switch (action.type) {
    case REQUEST: {
      return { ...state, loading: true, commentLoading: false };
    }
    case BUMP: {
      const { key, rows } = action.payload;
      const records = Object.assign(state.records[key] || {}, rows);
      return { records: { ...state.records, [key]: records }, loading: false, commentLoading: false };
    }
    case ADD: {
      const { parent, key } = action.payload;
      const records = { ...state.records };
      if (!records[parent]) records[parent] = {};
      if (!records[parent][key]) {
        // @ts-ignore
        records[parent][key] = action.payload;
      } else {
        // @ts-ignore
        records[parent][key] = { ...records[parent][key], ...action.payload };
      }
      return { records, loading: false, commentLoading: false };
    }

    case REQUEST_COMMENT: {
      return { ...state, commentLoading: true };
    }
    case UPDATE_COMMENT: {
      const { parent, key, comments } = action.payload;
      const records = { ...state.records };
      const post = records[parent][key];
      // @ts-ignore
      records[parent][key] = { ...post, comments };

      return { ...state, commentLoading: false };
    }
    default:
      return state;
  }
}