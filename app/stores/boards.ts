import { put, call, throttle } from 'redux-saga/effects';
import { createSelector } from 'reselect';
import qs from 'query-string';
import { StatusBar } from 'react-native';
import parseBoardList, { IParseBoard } from '../utils/parseBoard';
import arrayToObject from '../utils/arrayToObject';
import { createAction, ActionsUnion } from './helpers';

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

  add: (key: string, posts: PostRecord[]) => createAction(ADD, { key, posts }),
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

    yield put(Actions.add(key, json.rows));

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

export const getPostByKey = (key: string) => createSelector(
  [getBoardState],
  ({ posts }) => (key ? posts[key] : {}),
);

export const getBoardList = createSelector(
  [getBoardState],
  ({ order, posts }) => order.map((k: string) => posts[k]),
);

export const isBoardLoading = createSelector(
  [getBoardState],
  ({ loading }) => loading || false,
);

/* reducers */

export interface BoardState {
  readonly key: string;
  readonly posts: Readonly<{
    [key: string]: PostRecord;
  }>;
  readonly order: string[];
  readonly loading: boolean;
  readonly updated?: Date;
}

const initState: BoardState = {
  key: '',
  posts: {},
  order: [],
  loading: false,
  updated: undefined,
};

export default function reducer(state = initState, action: Actions) {
  switch (action.type) {
    case REQUEST: {
      const { key } = action.payload;
      let posts: any = [];
      let order: string[] = [];
      if (state.key === key) {
        posts = state.posts;
        order = state.order;
      }
      return { key, posts, order, loading: true };
    }
    case ADD: {
      const { key, posts } = action.payload;
      const newPosts = arrayToObject(posts);

      let newOrder: string[] = [];
      const postOrder = posts.map(item => item.key);

      if (state.order[0] === postOrder[0]) {
        newOrder = postOrder;
      } else if (state.order[0] > postOrder[0]) {
        newOrder = Array.from(new Set([...state.order, ...postOrder]));
      } else {
        newOrder = Array.from(new Set([...postOrder, ...state.order]));
      }

      return {
        ...state,
        posts: { ...state.posts, ...newPosts },
        order: newOrder,
        loading: false,
        updated: new Date(),
      };
    }
    case REMOVE: {
      const { key, post } = action.payload;

      const newPosts = { ...state.posts };
      delete newPosts[post];

      const newOrder = [...state.order];
      newOrder.splice(state.order.indexOf(post), 1);

      return {
        ...state,
        posts: newPosts,
        order: newOrder,
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