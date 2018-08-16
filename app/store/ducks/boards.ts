import { put, call, throttle } from 'redux-saga/effects';
import { createSelector } from 'reselect';
import parseBoardList from '../../utils/parseBoard';
import arrayToObject from '../../utils/arrayToObject';
import { createAction, ActionsUnion } from '../helpers';

/* Actions */

export const REQUEST = 'board/REQUEST';
export const ADD = 'board/ADD';
export const UPDATE = 'board/UPDATE';
export const CLEAR = 'board/CLEAR';

export const Actions = {
  request: (
    prefix: string,
    boardId?: string,
    page: number = 1,
    params?: { keyword?: string, category?: number }
  ) =>
    createAction(REQUEST, { prefix, boardId, page, params }),

  add: (payload: { title: string, data: BoardRecord[] }) => createAction(ADD, payload),
  update: (payload: { title: string, data: BoardRecord[] }) => createAction(UPDATE, payload),
  clear: () => createAction(CLEAR),
};
export type Actions = ActionsUnion<typeof Actions>;

/* Sagas */

export function* requestBoard({ payload }: ReturnType<typeof Actions.request>) {
  const { prefix, boardId, page, params } = payload;

  let targetUrl = `http://m.ruliweb.com/${prefix}${boardId ? `/board/${boardId}` : ''}?page=${page}`;
  if (params) targetUrl += `${params.keyword ? `&keyword=${params.keyword}`: '' }${params.category ? `&cate=${params.category}` : ''}`;

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
  
    const json = parseBoardList(htmlString);
    yield put(Actions.add(json));
  } catch(e) {
    return null;
  }
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

/* reducers */{

export interface BoardState {
  readonly prefix?: string;
  readonly boardId?: string;
  readonly page?: number;
  readonly title?: string;
  readonly params?: {
    readonly keyword?: string;
    readonly category?: string;
  };
  readonly records: Readonly<{
    [key: string]: BoardRecord;
  }>;
  readonly order: Readonly<string[]>
  readonly loading: boolean;
}

const initState: BoardState = { records: {}, order: [], loading: false };

export default function reducer(state = initState, action: Actions) {
  switch (action.type) {
    case REQUEST: {
      const { prefix, boardId, page, params } = action.payload;
      return { boardId, prefix, page, params, loading: true };
    }
    case ADD: {
      const { title, data } = action.payload;
      const order = data.map(item => item.key);
      const records = arrayToObject(data);
      return { ...state, title, records, order, loading: false };
    }
    case UPDATE: {
      const { title, data } = action.payload;

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
