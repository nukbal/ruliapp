import { put, call, takeLatest, take, race } from 'redux-saga/effects';
import { createSelector } from 'reselect';
import { showLoading, hideLoading } from './loading';
import cheerio from 'cheerio-without-node-native';

export const actionType = {
  REQUEST_COMMENTS: 'REQUEST_COMMENTS',
  REQUEST_COMMENTS_DONE: 'REQUEST_COMMENTS_DONE',
};

export function requestComments(prefix, boardId, articleId, page) {
  return {
    type: actionType.REQUEST_COMMENTS,
    payload: {
      prefix,
      boardId,
      articleId,
      page,
    },
  }
}

async function getComments({ prefix, boardId, articleId, page }) {
  const params = {
    page,
    article_id: articleId,
    board_id: boardId,
    cmtimg: 1,
  };

  const config = {
    method: 'GET',
    body: JSON.stringify(params),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept-Encoding': 'gzip, deflate',
      Referer: targetUrl,
      'User-Agent': 'Mozilla/5.0',
    }
  };

  const response = await fetch('https://api.ruliweb.com/commentView', config);
  const json = await response.json();

  if (!json.success) return;

  const $ = cheerio.load(json.view);

  const title = $('head title').text().replace('루리웹', '').replace('|', '').trim()

  const items = $('table.board_list_table tbody tr').map((_, row) => {
    const id = $('td.id', row).text().trim();
    return {
      id,
      key: id,
      type: $('td.divsn a', row).text().trim(),
      title: $('td.subject a.deco', row).text().trim(),
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
  }
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
];

export const getBoardState = state => state.boards;

export const getBoardList = createSelector(
  [getBoardState],
  boards =>  boards.items,
);

export const getBoardInfo = createSelector(
  [getBoardState],
  ({ boardId, prefix }) => ({
    boardId,
    prefix,
  }),
);

const initState = {};

const actionHandler = {
  [actionType.REQUEST_BOARD_LIST]: (state, { payload }) => {
    const { prefix, boardId } = payload;
    return { boardId, prefix, loading: true };
  },
  [actionType.REQUEST_BOARD_LIST_DONE]: (state, { payload }) => {
    const { prefix, boardId } = state;
    const { title, items } = payload;
    return { boardId, prefix, title, items };
  }
};

export default function reducer(state = initState, action = {}) {
  const handler = actionHandler[action.type];
  return handler ? handler(state, action) : state;
}
