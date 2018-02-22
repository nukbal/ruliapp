import { put, call, takeLatest, take, race } from 'redux-saga/effects';
import { createSelector } from 'reselect';
import { hideFullLoading } from './loading';
import cheerio from 'cheerio-without-node-native';

export const actionType = {
  REQUEST_BOARD_LIST: 'REQUEST_BOARD_LIST',
  REQUEST_BOARD_LIST_DONE: 'REQUEST_BOARD_LIST_DONE',
};

export function requestBoardList(prefix, boardId) {
  return {
    type: actionType.REQUEST_BOARD_LIST,
    payload: {
      prefix,
      boardId,
    },
  }
}

async function getListData(prefix, boardId) {
  const targetUrl = `https://bbs.ruliweb.com/${prefix}/board/${boardId}`;

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

  console.log('sssss');
  const response = await fetch(targetUrl, config);
  const htmlString = await response.text();

  console.log('2222');

  const $ = cheerio.load(htmlString);

  const title = $('head title').text().replace('루리웹', '').replace('|', '').trim()

  const items =  $('table.board_list_table tbody tr').map((_, row) => ({
    key: $('td.id', row).text().trim(),
    type: $('td.divsn a', row).text().trim(),
    title: $('td.subject a.deco', row).text().trim(),
    comments: $('td.subject span.num_reply span.num', row).text().trim(),
    author: $('td.writer a').text().trim(),
    like: $('td.recomd').text().trim(),
    views: $('td.hit').text().trim(),
    times: $('td.time').text().trim(),
  }));

  return {
    title,
    items,
  }
}

export function* requestBoard({ payload }) {
  const { prefix, boardId } = payload;
  const json = yield call(getListData, prefix, boardId);

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

const initState = {};

const actionHandler = {
  [actionType.REQUEST_BOARD_LIST]: (state, { payload }) => {
    const { prefix, boardId } = payload;
    return { boardId, prefix };
  },
  [actionType.REQUEST_BOARD_LIST_DONE]: (state, { payload }) => {
    return Object.assign(state, { ...payload });
  }
};

export default function reducer(state = initState, action = {}) {
  const handler = actionHandler[action.type];
  return handler ? handler(state, action) : state;
}
