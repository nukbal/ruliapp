import { put, call, throttle } from 'redux-saga/effects';
import { createSelector } from 'reselect';
import qs from 'query-string';
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
  ) =>
    createAction(REQUEST, { key, params }),

  add: (key: string, posts: string[]) => createAction(ADD, { key, posts }),
  update: (payload: IParseBoard) => createAction(UPDATE, payload),
  remove: (key: string) => createAction(REMOVE, key),
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

  try {
    const response = yield call(fetch, targetUrl, config);
    const htmlString = yield response.text();
    const json: IParseBoard = yield call(parseBoardList, htmlString, key);

    // @ts-ignore
    yield put(PostActions.bump(key, arrayToObject(json.rows)));

    const idList = json.rows.map(item => item.key);
    yield put(Actions.add(key, idList));
  } catch(e) {
    console.error(e);
    return;
  }
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
      return {
        records: {
          ...state.records,
          [key]: { posts, updatedAt: new Date() },
        },
        loading: false,
      };
    }
    case UPDATE: {
      const { order, ...rest } = state;
      // const newOrder = mergeArray(order, rows.map(item => item.key));

      return { ...rest, loading: false };
    }
    case REMOVE: {
      const key = action.payload;
      const { order, ...rest } = state;

      const newOrder = [...order];
      newOrder.splice(order.indexOf(key), 1);

      return { order: newOrder, updatedAt: new Date(), ...rest };
    }
    case CLEAR: {
      return initState;
    }
    default: {
      return state;
    }
  }
}