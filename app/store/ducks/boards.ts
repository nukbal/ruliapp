import { put, call, takeLatest, take, throttle } from 'redux-saga/effects';
import { createSelector } from 'reselect';
import { parseBoardList } from '../../utils/parser';
import arrayToObject from '../../utils/arrayToObject';
import mergeArray from '../../utils/mergeArray';
import { createAction, ActionsUnion } from '../helpers';

/* Actions */

export const REQUEST_BOARD_LIST = 'REQUEST_BOARD_LIST';
export const REQUEST_BOARD_LIST_DONE = 'REQUEST_BOARD_LIST_DONE';
export const UPDATE_BOARD_LIST = 'UPDATE_BOARD_LIST';
export const UPDATE_BOARD_LIST_DONE = 'UPDATE_BOARD_LIST_DONE';
export const DELETE_BOARD_ITEM = 'DELETE_BOARD_ITEM';

export const Actions = {
  requestBoardList: (prefix, boardId, page, keyword) =>
    createAction(REQUEST_BOARD_LIST, { prefix, boardId, page, keyword }),

  updateBoardList: (prefix, boardId, page, keyword) =>
    createAction(UPDATE_BOARD_LIST, { prefix, boardId, page, keyword }),

  requestBoardListDone: (payload: any) =>
    createAction(REQUEST_BOARD_LIST_DONE, payload),

  updateBoardListDone: (payload: any, meta: any) =>
    createAction(UPDATE_BOARD_LIST_DONE, payload, meta),
};
export type Actions = ActionsUnion<typeof Actions>;

/* Sagas */

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

export function* updateBoard({ payload }: ReturnType<typeof Actions.updateBoardList>) {
  const json = yield call(getListData, payload);
  if (!json) return;

  yield put(Actions.updateBoardListDone(json, { isAppend: payload.append }));
}

export function* requestBoard({ payload }: ReturnType<typeof Actions.requestBoardList>) {
  const json = yield call(getListData, payload);
  if (!json) return;

  yield put(Actions.requestBoardListDone(json));
}

export const boardSagas = [
  takeLatest(REQUEST_BOARD_LIST, requestBoard),
  throttle(250, UPDATE_BOARD_LIST, updateBoard),
];

/* selectors */

export const getBoardState = state => state.boards;

export const getBoardList = createSelector(
  [getBoardState],
  ({ order, data }) => {
    if (order && data) {
      return order.map(key => data[key]);
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

const initState = {};

export default function reducer(state = initState, action: Actions) {
  switch (action.type) {
    case REQUEST_BOARD_LIST:
      const { prefix, boardId, page, keyword } = action.payload;
      return { boardId, prefix, page, keyword, loading: true };

    case REQUEST_BOARD_LIST_DONE:
      // @ts-ignore
      const { title, items } = action.payload;
      const order = items.map(item => item.key);
      const data = arrayToObject(items, 'key');
      return { ...state, title, data, order };

    case UPDATE_BOARD_LIST:
      return { ...state, page: action.payload.page, loading: true };

    case UPDATE_BOARD_LIST_DONE:
      const { payload, meta } = action;
      // @ts-ignore
      const { items } = payload;
    
      let newOrder = mergeArray(order, items.map(item => item.key));
      let newData = Object.assign(data, arrayToObject(items, 'key'));

      if (meta.isAppend) {
        newOrder = mergeArray(order, items.map(item => item.key));
        newData = Object.assign(data, arrayToObject(items, 'key'));
      } else {
        newOrder = mergeArray(items.map(item => item.key), order);
        newData = Object.assign(data, arrayToObject(items, 'key'));
      }

      return { ...state, data: newData, order: newOrder, loading: false };
    default:
      return state;
  }
}
