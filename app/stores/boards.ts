import { put, call, throttle } from 'redux-saga/effects';
import { createSelector } from 'reselect';
import qs from 'query-string';
import { StatusBar } from 'react-native';
import parseBoardList, { IParseBoard } from '../utils/parseBoard';
import arrayToObject from '../utils/arrayToObject';
import { createAction, ActionsUnion } from './helpers';

import { Actions as PostActions, getPostRecordsByParent } from './posts';

/* Actions */
export const REQUEST = 'board/REQUEST';
export const ADD = 'board/ADD';
export const UPDATE = 'board/UPDATE';
export const CLEAR = 'board/CLEAR';
export const REMOVE = 'board/REMOVE';

export const Actions = {
  request: (
    key: string,
    params: { page: number, keyword?: string, cate?: string } = { page: 1 },
    callback?: () => void,
  ) =>
    createAction(REQUEST, { key, params, callback }),

  add: (key: string, posts: string[]) => createAction(ADD, { key, posts }),
  remove: (key: string, post: string) => createAction(REMOVE, { key, post }),
  clear: () => createAction(CLEAR),
};
export type Actions = ActionsUnion<typeof Actions>;

/* Sagas */
export function* requestBoard({ payload }: ReturnType<typeof Actions.request>) {
  const { key, params } = payload;

  let targetUrl = `http://m.ruliweb.com/${key}`;

  if (params) {
    const query = qs.stringify(params);
    targetUrl += '?' + query;
  }

  const config = {
    method: 'GET',
    headers: {
      Accept: 'text/html',
      'Content-Type': 'text/html',
      'Accept-Encoding': 'gzip, deflate',
      Referer: targetUrl,
    }
  };
  StatusBar.setNetworkActivityIndicatorVisible(true);

  try {
    const response = yield call(fetch, targetUrl, config);
    const htmlString = yield response.text();
    const json: IParseBoard = yield call(parseBoardList, htmlString, key);

    // @ts-ignore
    yield put(PostActions.bump(key, arrayToObject(json.rows)));

    const idList = json.rows.map(item => item.key);
    yield put(Actions.add(key, idList));

    if (payload.callback) yield call(payload.callback);
  } catch(e) {
    console.error(e);
  }

  StatusBar.setNetworkActivityIndicatorVisible(false);
}

export const boardSagas = [
  throttle(500, REQUEST, requestBoard),
];

/* selectors */

export const getBoardState = (state: any): BoardState => state.board;

export const getBoardList = (key: string) => createSelector(
  [getBoardState, getPostRecordsByParent(key)],
  ({ records }, posts) => {
    if (!key) return [];
    const data = records[key] ? records[key].posts : [];
    return data.map((k: string) => posts[k]);
  },
);

export const isBoardLoading = createSelector(
  [getBoardState],
  ({ loading }) => loading || false,
);

/* reducers */

export interface BoardState {
  readonly records: Readonly<{
    [key: string]: BoardRecord,
  }>;
  readonly loading: boolean;
}

const initState: BoardState = {
  records: {},
  loading: false,
};

export default function reducer(state = initState, action: Actions) {
  switch (action.type) {
    case REQUEST: {
      const { key } = action.payload;
      const records = { ...state.records };
      if (records[key]) {
        records[key] = { ...records[key], key };
      } else {
        // @ts-ignore
        records[key] = { key, posts: [] };
      }
      return { records, loading: true };
    }
    case ADD: {
      const { key, posts } = action.payload;
      const current = state.records[key];
      let newPosts: string[] = [];

      if (current.posts[0] === posts[0]) {
        newPosts = posts;
      } else if (current.posts[0] > posts[0]) {
        newPosts = Array.from(new Set([...current.posts, ...posts]));
      } else {
        newPosts = Array.from(new Set([...posts, ...current.posts]));
      }

      return {
        records: {
          ...state.records,
          [key]: { posts: newPosts, updatedAt: new Date() },
        },
        loading: false,
      };
    }
    case REMOVE: {
      const { key, post } = action.payload;
      const current = state.records[key];

      const newOrder = [...current.posts];
      newOrder.splice(current.posts.indexOf(post), 1);

      return {
        records: { ...state.records, [key]: { ...current, posts: newOrder }},
        loading: false,
      };
    }
    case CLEAR: {
      return initState;
    }
    default: {
      return state;
    }
  }
}