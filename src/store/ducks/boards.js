import { put, call, takeLatest, take, throttle } from 'redux-saga/effects';
import { createSelector } from 'reselect';
import { hideFullLoading } from './loading';
import { parseBoardList } from '../../utils/parser';
import { arrayToObject, mergeArray } from '../../utils/commonUtils';

export const actionType = {
  REQUEST_BOARD_LIST: 'REQUEST_BOARD_LIST',
  REQUEST_BOARD_LIST_DONE: 'REQUEST_BOARD_LIST_DONE',
  UPDATE_BOARD_LIST: 'UPDATE_BOARD_LIST',
  UPDATE_BOARD_LIST_DONE: 'UPDATE_BOARD_LIST_DONE',
  DELETE_BOARD_ITEM: 'DELETE_BOARD_ITEM',
};

export function requestBoardList(prefix, boardId, page, keyword) {
  return {
    type: actionType.REQUEST_BOARD_LIST,
    payload: {
      prefix,
      boardId,
      page,
      keyword,
    },
  }
}

export function updateBoardList(prefix, boardId, page) {
  return {
    type: actionType.UPDATE_BOARD_LIST,
    payload: {
      prefix,
      boardId,
      page,
    },
  }
}

async function getListData({ prefix, boardId, page, keyword }) {
  const targetUrl = `https://bbs.ruliweb.com/${prefix}${boardId ? `/board/${boardId}` : ''}?page=${page}${keyword ? `&search_type=subject&search_key=${keyword}` : ''}`;

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

  const response = await fetch(targetUrl, config);
  const htmlString = await response.text();

  return parseBoardList(htmlString, page);
}

export function* updateBoard({ payload }) {
  const json = yield call(getListData, payload);

  yield put({
    type: actionType.UPDATE_BOARD_LIST_DONE,
    payload: json,
  });
}

export function* requestBoard({ payload }) {
  const json = yield call(getListData, payload);

  yield put({
    type: actionType.REQUEST_BOARD_LIST_DONE,
    payload: json,
  });
}

export const boardSagas = [
  takeLatest(actionType.REQUEST_BOARD_LIST, requestBoard),
  throttle(250, actionType.UPDATE_BOARD_LIST, updateBoard),
];

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

const initState = {};

const actionHandler = {
  [actionType.REQUEST_BOARD_LIST]: (state, { payload }) => {
    const { prefix, boardId, page, keyword } = payload;
    return { boardId, prefix, page, keyword, loading: true };
  },
  [actionType.REQUEST_BOARD_LIST_DONE]: (state, { payload }) => {
    const { prefix, boardId, page } = state;
    const { title, items } = payload;

    const order = items.map(item => item.key);
    const data = arrayToObject(items, 'key');
    return { boardId, prefix, page, title, data, order };
  },
  [actionType.UPDATE_BOARD_LIST]: (state, { payload }) => {
    const { page, ...rest } = state;
    return { page: payload.page, loading: true, ...rest };
  },
  [actionType.UPDATE_BOARD_LIST_DONE]: (state, { payload }) => {
    const { data, order, loading, ...rest } = state;
    const { items } = payload;

    const newOrder = mergeArray(order, items.map(item => item.key));
    const newData = Object.assign(data, arrayToObject(items, 'key'));
    return { data: newData, order: newOrder, ...rest };
  },
  // [actionType.DELETE_BOARD_ITEM]: (state, { payload }) => {
  //   const { data, order, ...rest } = state;
  //   delete data[payload];
  //   const newOrder = 
  // },
};

export default function reducer(state = initState, action = {}) {
  const handler = actionHandler[action.type];
  return handler ? handler(state, action) : state;
}
