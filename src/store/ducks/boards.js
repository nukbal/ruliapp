import { put, call, takeLatest, take, race } from 'redux-saga/effects';
import { createSelector } from 'reselect';
import { hideFullLoading } from './loading';
import cheerio from 'cheerio-without-node-native';

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

  const $ = cheerio.load(htmlString);

  const title = $('head title').text().replace('루리웹', '').replace('|', '').trim()

  const items = $('table.board_list_table tbody tr').map((_, row) => {
    const link = $('td.subject a' ,row).attr('href').replace('http://bbs.ruliweb.com/', '');
    const id = link.substring(link.lastIndexOf('/'), link.length);
    const prefix = link.substring(0, link.indexOf('/'));
    const boardId = link.substring(link.indexOf('board/') + 6, link.indexOf('/read'));
    return {
      id,
      key: `prefix_${boardId}_${id}`,
      prefix,
      boardId,
      type: $('td.divsn a', row).text().trim(),
      title: $('td.subject a', row).text().trim(),
      comments: $('td.subject span.num_reply span.num', row).text().trim(),
      author: $('td.writer a', row).text().trim(),
      likes: $('td.recomd', row).text().trim(),
      views: $('td.hit', row).text().trim(),
      times: $('td.time', row).text().trim(),
    };
  }).get();

  return {
    title,
    items,
    page,
  }
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
