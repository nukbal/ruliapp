import { put, call, takeLatest, take, throttle } from 'redux-saga/effects';
import { createSelector } from 'reselect';
import { parseBoardList } from '../../utils/parser';
import arrayToObject from '../../utils/arrayToObject';
import mergeArray from '../../utils/mergeArray';
import { createAction, ActionsUnion } from '../helpers';

/* Actions */

export const REQUEST = 'board/REQUEST';
export const SET = 'board/SET';
export const UPDATE = 'board/UPDATE';
export const DELETE = 'board/DELETE';

export const Actions = {
  request: (prefix: string, boardId: string, page: number, keyword: string) =>
    createAction(REQUEST, { prefix, boardId, page, keyword }),

  set: (payload: any[]) => createAction(SET, payload),
  update: (payload: any[]) => createAction(UPDATE, payload),
  delete: (payload: any[]) => createAction(DELETE, payload),
};
export type Actions = ActionsUnion<typeof Actions>;

/* Sagas */

// @ts-ignore
async function getListData({ prefix, boardId, page, keyword }) {
  const targetUrl = `http://bbs.ruliweb.com/${prefix}${boardId ? `/board/${boardId}` : ''}?page=${page}${keyword ? `&search_type=subject&search_key=${keyword}` : ''}`;

  const config = {
    method: 'GET',
    headers: {
      Accept: 'text/html',
      'Content-Type': 'text/html',
      'Accept-Encoding': 'gzip, deflate',      
      Referer: targetUrl,
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
    }
  };

  try {
    const response = await fetch(targetUrl, config);
    const htmlString = await response.text();
  
    return parseBoardList(htmlString, page);
  } catch(e) {
    return null;
  }
}

export function* requestBoard({ payload }: ReturnType<typeof Actions.request>) {
  const json = yield call(getListData, payload);
  if (!json) return;

  yield put(Actions.set(json));
}

export const boardSagas = [
  throttle(250, REQUEST, requestBoard),
];

/* selectors */

export const getBoardState = (state: any) => state.boards;

export const getBoardList = createSelector(
  [getBoardState],
  ({ order, data }) => {
    if (order && data) {
      return order.map((key: string) => data[key]);
    }
    return undefined;
  }
);

export const getBoardInfo = createSelector(
  [getBoardState],
  ({ boardId, prefix, title, page }) => ({
    boardId,
    prefix,
    title,
    page,
  }),
);

export const isBoardLoading = createSelector(
  [getBoardState],
  ({ loading }) => loading || false,
);

/* reducers */

export interface BoardState {
  readonly prefix?: string;
  readonly boardId?: string;
  readonly page?: number;
  readonly param?: {
    readonly keyword?: string;
    readonly category?: string;
  };
  readonly loading: boolean;
}

const initState: BoardState = { loading: false };

export default function reducer(state = initState, action: Actions) {
  switch (action.type) {
    case REQUEST: {
      const { prefix, boardId, page, keyword } = action.payload;
      return { boardId, prefix, page, keyword, loading: true };
    }
    case SET: {
      // @ts-ignore
      const { title, items } = action.payload;
      const order = items.map((item: any) => item.key);
      const data = arrayToObject(items, 'key');
      return { ...state, title, data, order, loading: false };
    }
    case UPDATE: {
      const { payload, meta } = action;
      // @ts-ignore
      const { items } = payload;
    
      // let newOrder = mergeArray(order, items.map(item => item.key));
      // let newData = Object.assign(data, arrayToObject(items, 'key'));

      // if (meta.isAppend) {
      //   newOrder = mergeArray(order, items.map(item => item.key));
      //   newData = Object.assign(data, arrayToObject(items, 'key'));
      // } else {
      //   newOrder = mergeArray(items.map(item => item.key), order);
      //   newData = Object.assign(data, arrayToObject(items, 'key'));
      // }

      return { ...state, loading: false };
    }
    default: {
      return state;
    }
  }
}
