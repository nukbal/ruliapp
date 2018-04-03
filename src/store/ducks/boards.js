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
};

export function requestBoardList(prefix, boardId, page) {
  return {
    type: actionType.REQUEST_BOARD_LIST,
    payload: {
      prefix,
      boardId,
      page,
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

async function getListData(prefix, boardId, page) {
  const targetUrl = `https://bbs.ruliweb.com/${prefix}${boardId ? `/board/${boardId}` : ''}?page=${page}`;

  const config = {
    method: 'GET',
    headers: {
      Accept: 'text/html',
      'Content-Type': 'text/html',
      // 'Accept-Encoding': 'gzip, deflate',      
      Referer: targetUrl,
      'User-Agent': 'Mozilla/5.0',
    }
  };

  const response = await fetch(targetUrl, config);
  const htmlString = await response.text();

  return parseBoardList(htmlString, page);
}

export function* updateBoard({ payload }) {
  const { prefix, boardId, page } = payload;
  const json = yield call(getListData, prefix, boardId, page);

  yield put({
    type: actionType.UPDATE_BOARD_LIST_DONE,
    payload: json,
  });
}

export function* requestBoard({ payload }) {
  const { prefix, boardId, page } = payload;
  const json = yield call(getListData, prefix, boardId, page);

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
    return [];
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
    const { prefix, boardId, page } = payload;
    return { boardId, prefix, page, loading: true };
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
  }
};

export default function reducer(state = initState, action = {}) {
  const handler = actionHandler[action.type];
  return handler ? handler(state, action) : state;
}
