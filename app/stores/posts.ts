import { put, call, takeLatest, select, throttle } from 'redux-saga/effects';
import { createSelector } from 'reselect';
import { Alert, Platform, StatusBar, AsyncStorage } from 'react-native';
import { Actions as BoardAction, getPostByKey } from './boards';
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
  remove: (url: string) => createAction(REMOVE, url),

  requestComment: (payload: { key: string, url: string, parent: string }) =>
    createAction(REQUEST_COMMENT, payload),
  updateComment: (comments: CommentRecord[]) =>
    createAction(UPDATE_COMMENT, comments),
};
export type Actions = ActionsUnion<typeof Actions>;

/* Selectors */

export const getPosts = (state: any): PostState => state.post;

export const getPostContents = createSelector([getPosts], posts => posts.contents);
export const getPostComments = createSelector([getPosts], posts => posts.comments);
export const getPostMeta = createSelector([getPosts], posts => ({
  commentSize: posts.commentSize || 0,
  views: posts.views || 0,
  likes: posts.likes || 0,
  dislikes: posts.dislikes || 0,
  url: posts.url,
  date: posts.date,
}));

export const isPostLoading = createSelector([getPosts], posts => posts.loading);
export const isCommentLoading = createSelector([getPosts], posts => posts.commentLoading);

/* Sagas */

export function* requestDetailSaga({ payload }: ReturnType<typeof Actions.request>) {
  const { key, parent, url } = payload;

  const cache = yield AsyncStorage.getItem(`@Posts:${url}`);
  if (cache) {
    const json = JSON.parse(cache);
    yield put(Actions.add(json));
    return;
  }

  StatusBar.setNetworkActivityIndicatorVisible(false);
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
    if (!response.ok) throw new Error('request failed');

    const htmlString = yield response.text();
    const json = yield call(parsePost, htmlString, '');
    if (!json) throw new Error('parse failed');

    const record = yield select(getPostByKey(key));

    const data = { ...record, ...json, order: json.comments.map((item: CommentRecord) => item.key) };
    yield AsyncStorage.setItem(`@Posts:${url}`, JSON.stringify(data));
    yield put(Actions.add(data));
  } catch (e) {
    yield put(BoardAction.remove(parent, key));
    yield put(Actions.remove(url));
    Alert.alert('error', '해당 글이 존재하지 않습니다.');
  }
  StatusBar.setNetworkActivityIndicatorVisible(false);
}

export function* requestComments({ payload }: ReturnType<typeof Actions.requestComment>) {
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

  StatusBar.setNetworkActivityIndicatorVisible(true);
  try {
    // @ts-ignore
    const response = yield call(fetch, 'http://api.ruliweb.com/commentView', config);
    const json = yield response.json();
  
    if (json.success) {
      const comments = yield call(parseComment, json.view);
      yield put(Actions.updateComment(comments));

      const cache = yield AsyncStorage.getItem(`@Posts:${url}`);
      const data = JSON.parse(cache);
      yield AsyncStorage.setItem(`@Posts:${url}`, JSON.stringify({ ...data, comments }));
    }
  } catch(e) {}
  StatusBar.setNetworkActivityIndicatorVisible(false);
  return null;
}

function* removePost({ payload }: ReturnType<typeof Actions.remove>) {
  yield AsyncStorage.removeItem(`@Posts:${payload}`);
}

export const postSagas = [
  takeLatest(REQUEST, requestDetailSaga),
  throttle(500, REQUEST_COMMENT, requestComments),
  takeLatest(REMOVE, removePost),
];

/* Reducer */

export interface PostState extends PostRecord {
  readonly loading: boolean;
  readonly commentLoading: boolean;
}

const initState: PostState = {
  key: '',
  url: '',
  parent: '',
  subject: '',
  user: { id: '', name: '' },
  comments: [],
  contents: [],
  loading: false,
  commentLoading: false,
};

export default function reducer(state = initState, action: Actions) {
  switch (action.type) {
    case REQUEST: {
      return { ...initState, ...action.payload, loading: true, commentLoading: false, updated: new Date() };
    }
    case ADD: {
      return { ...state, ...action.payload, loading: false, commentLoading: false };
    }
    case REQUEST_COMMENT: {
      return { ...state, commentLoading: true };
    }
    case UPDATE_COMMENT: {

      // const oldkeys = state.comments.map(item => item.key);
      // const newKeys = comments.map(item => item.key);

      // let list = Array.from(new Set([...oldkeys, ...newKeys]));
      // list = list.map(key => );

      return { ...state, comments: action.payload, commentLoading: false };
    }
    case REMOVE: {
      return initState;
    }
    default:
      return state;
  }
}