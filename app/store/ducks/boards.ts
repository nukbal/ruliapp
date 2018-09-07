import { put, call, throttle } from 'redux-saga/effects';
import { createSelector } from 'reselect';
import qs from 'query-string';
import parseBoardList from '../../utils/parseBoard';
import { createAction, ActionsUnion } from '../helpers';
import realm from '../realm';

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

  add: (title: string, rows: string[]) => createAction(ADD, { title, rows }),
  update: (payload: string[]) => createAction(UPDATE, payload),
  remove: (key: string) => createAction(REMOVE, key),
  clear: () => createAction(CLEAR),
};
export type Actions = ActionsUnion<typeof Actions>;

/* realm */
function load(key: string) {
  return new Promise((res, rej) => {
    try {
      const board = realm.objectForPrimaryKey('Board', key);
      if (board) {
        const updatedTime = board.updated.getTime();
        const currentTime = new Date().getTime();
        if (currentTime - updatedTime < 60000) {
          res(board);
          return;
        }
      }
      res();
    } catch (e) {
      rej(e);
    }
  });
}

function save(key: string, { title, rows, notices }: ReturnType<typeof parseBoardList>) {
  return new Promise((res, rej) => {
    try {
      realm.write(() => {
        const board = realm.create('Board', { key, title, updated: new Date() }, true);
        for (let i = 0, len = rows.length; i < len; i += 1) {
          const exists = board.posts.filtered('key = $0', rows[i].key);
          if (exists.length === 0) {
            board.posts.push(rows[i]);
          }
        }
        res(board);
      });
    } catch (e) {
      rej(e);
    }
  });
}


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
  const key = `${prefix}${boardId ? `_${boardId}` : ''}`;

  try {
    let data = yield call(load, key);
    if (!data) {
      const response = yield call(fetch, targetUrl, config);
      const htmlString = yield response.text();
      const json = yield call(parseBoardList, htmlString);
      data = yield call(save, key, json);
    }

    const keys = data.posts.sorted('date', true).map((item: PostRecord) => item.key);
    yield put(Actions.add(data.title, keys));
  } catch(e) {
    console.warn(e);
    return;
  }
}

export const boardSagas = [
  throttle(1000, REQUEST, requestBoard),
];

/* selectors */

export const getBoardState = (state: AppState): BoardState => state.boards;

export const getBoardList = createSelector(
  [getBoardState],
  ({ records }) => records,
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
  readonly records: string[];
  readonly loading: boolean;
}

const initState: BoardState = { records: [], loading: false };

export default function reducer(state = initState, action: Actions) {
  switch (action.type) {
    case REQUEST: {
      const { prefix, boardId, params, update } = action.payload;
      if (update) {
        return { ...state, boardId, prefix, params, loading: true };
      }
      return { ...initState, boardId, prefix, params, loading: true };
    }
    case ADD: {
      const { title, rows } = action.payload;
      return { ...state, title, records: rows, loading: false };
    }
    case UPDATE: {
      const { records, ...rest } = state;
      const newRecords = [ ...records, ...action.payload ];

      return { ...rest, records: newRecords, loading: false };
    }
    case REMOVE: {
      const key = action.payload
      if (key in state.records) {
        const { records, ...rest } = state;

        const newRecord = [...records];
        newRecord.splice(records.indexOf(key), 1);

        return { records: newRecord, ...rest };
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
