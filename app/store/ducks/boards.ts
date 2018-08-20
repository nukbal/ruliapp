import { put, call, throttle } from 'redux-saga/effects';
import { createSelector } from 'reselect';
import qs from 'query-string';
import parseBoardList, { IParseBoard } from '../../utils/parseBoard';
import arrayToObject from '../../utils/arrayToObject';
import mergeArray from '../../utils/mergeArray';
import { createAction, ActionsUnion } from '../helpers';

/* Actions */
export const REQUEST = 'board/REQUEST';
export const ADD = 'board/ADD';
export const UPDATE = 'board/UPDATE';
export const CLEAR = 'board/CLEAR';
export const REMOVE = 'board/REMOVE';

export const Actions = {
  request: (
    prefix: string,
    boardId?: string,
    params: { page: number, keyword?: string, cate?: string } = { page: 1 },
    update?: boolean,
  ) =>
    createAction(REQUEST, { prefix, boardId, params, update }),

  add: (payload: IParseBoard) => createAction(ADD, payload),
  update: (payload: IParseBoard) => createAction(UPDATE, payload),
  remove: (key: string) => createAction(REMOVE, key),
  clear: () => createAction(CLEAR),
};
export type Actions = ActionsUnion<typeof Actions>;

/* Sagas */
export function* requestBoard({ payload }: ReturnType<typeof Actions.request>) {
  const { prefix, boardId, params } = payload;

  let targetUrl = `http://m.ruliweb.com/${prefix}${boardId ? `/board/${boardId}` : ''}`;

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
    const json = yield call(parseBoardList, htmlString);

    yield put(Actions.add(json));
  } catch(e) {
    console.error(e);
    return;
  }
}

export const boardSagas = [
  throttle(250, REQUEST, requestBoard),
];

/* selectors */

export const getBoardState = (state: AppState): BoardState => state.boards;

export const getBoardList = createSelector(
  [getBoardState],
  ({ order, records }) => {
    if (order && records) {
      return order.map((key: string) => records[key]);
    }
    return;
  }
);

export const getBoardInfo = createSelector(
  [getBoardState],
  ({ boardId, prefix, title, params }) => ({
    boardId,
    prefix,
    title,
    params,
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
  readonly title?: string;
  readonly params?: Readonly<{
    readonly page: number;
    readonly keyword?: string;
    readonly cate?: string;
  }>;
  readonly records: Readonly<{
    [key: string]: BoardRecord;
  }>;
  readonly order: string[];
  readonly loading: boolean;
}

const initState: BoardState = { records: {}, order: [], loading: false };

export default function reducer(state = initState, action: Actions) {
  switch (action.type) {
    case REQUEST: {
      const { prefix, boardId, params, update } = action.payload;
      if (update) {
        return { ...state, boardId, prefix, params, loading: true };
      }
      return { boardId, prefix, params, loading: true };
    }
    case ADD: {
      const { title, rows } = action.payload;
      const order = rows.map(item => item.key);
      const records = arrayToObject(rows);
      return { ...state, title, records, order, loading: false };
    }
    case UPDATE: {
      const { records, order, ...rest } = state;
      const { rows } = action.payload;
      
      const newRows = arrayToObject(rows);
      const newRecords = { ...records, ...newRows };

      const newOrder = mergeArray(order, rows.map(item => item.key));

      return { ...rest, records: newRecords, order: newOrder, loading: false };
    }
    case REMOVE: {
      const key = action.payload
      if (key in state.records) {
        const { records, order, ...rest } = state;

        const newRecords = { ...records };
        delete newRecords[key];

        const newOrder = [...order];
        newOrder.splice(order.indexOf(key), 1);

        return { records: newRecords, order: newOrder, ...rest };
      }
      return state;
    }
    case CLEAR: {
      return initState;
    }
    default: {
      return state;
    }
  }
}
