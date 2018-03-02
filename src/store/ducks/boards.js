import { put, call, takeLatest, take, race } from 'redux-saga/effects';
import { createSelector } from 'reselect';
import { hideFullLoading } from './loading';
import { parseBoardList } from '../../utils/parser';

export const actionType = {
  REQUEST_BOARD_LIST: 'REQUEST_BOARD_LIST',
  REQUEST_BOARD_LIST_DONE: 'REQUEST_BOARD_LIST_DONE',
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

async function getListData(prefix, boardId, page) {
  const targetUrl = `https://bbs.ruliweb.com/${prefix}${boardId ? `/board/${boardId}` : ''}?page=${page}`;

  const config = {
    method: 'GET',
    headers: {
      Accept: 'text/html',
      'Content-Type': 'text/html',
      'Accept-Encoding': 'gzip, deflate',
      Referer: targetUrl,
      'User-Agent': 'Mozilla/5.0',
    }
  };

  const response = await fetch(targetUrl, config);
  const htmlString = await response.text();

  return parseBoardList(htmlString, page);
}

export function* requestBoard({ payload }) {
  const { prefix, boardId, page } = payload;
  const json = yield call(getListData, prefix, boardId, page);

  yield put({
    type: actionType.REQUEST_BOARD_LIST_DONE,
    payload: json,
  });

  yield put(hideFullLoading());
}

export const boardSagas = [
  takeLatest(actionType.REQUEST_BOARD_LIST, requestBoard),
];

export const getBoardState = state => state.boards;

export const getBoardList = createSelector(
  [getBoardState],
  boards =>  boards.items,
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
    return { boardId, prefix, page, title, items };
  }
};

export default function reducer(state = initState, action = {}) {
  const handler = actionHandler[action.type];
  return handler ? handler(state, action) : state;
}
