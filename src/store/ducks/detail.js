// https://api.ruliweb.com/commentView
// formData
// page:1
// article_id:2149929
// board_id:300007
// cmtimg:0
import { put, call, takeLatest, take, race } from 'redux-saga/effects';
import { createSelector } from 'reselect';
import { showLoading, hideLoading } from './loading';
import cheerio from 'cheerio-without-node-native';

export const actionType = {
  REQUEST_DETAIL: 'REQUEST_DETAIL',
  REQUEST_DETAIL_DONE: 'REQUEST_DETAIL_DONE',
};

export function requestDetail(prefix, boardId, articleId) {
  return {
    type: actionType.REQUEST_DETAIL,
    payload: {
      prefix,
      boardId,
      articleId,
    },
  }
}

async function getDetailData(prefix, boardId, articleId) {
  const targetUrl = `https://bbs.ruliweb.com/${prefix}/board/${boardId}/read/${id}`;

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

  const title = $('head title').text().replace('루리웹', '').replace('|', '').trim();

  const reference = $('div.source_url a').attr('href');
  const contents = $('div.board_main_view .view_content').text().trim();
  const likes = $('span.like_value').text();

  return {
    title,
    reference,
    likes,
  }
}

export function* requestDetailSaga({ payload }) {
  const { prefix, boardId, articleId } = payload;
  yield put(showLoading());

  const json = yield call(getDetailData, prefix, boardId, articleId);

  yield put({
    type: actionType.REQUEST_DETAIL_DONE,
    payload: json,
  });

  yield put(hideLoading());
}

export const detailSaga = [
  takeLatest(actionType.REQUEST_DETAIL, requestDetailSaga),
];

export const getDetail = state => state.detail;

const initState = {};

const actionHandler = {
  [actionType.REQUEST_BOARD_LIST]: (state, { payload }) => {
    const { prefix, boardId, articleId } = payload;
    return { boardId, prefix, articleId };
  },
  [actionType.REQUEST_BOARD_LIST_DONE]: (state, { payload }) => {
    return Object.assign(state, { ...payload });
  }
};

export default function reducer(state = initState, action = {}) {
  const handler = actionHandler[action.type];
  return handler ? handler(state, action) : state;
}
