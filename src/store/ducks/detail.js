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
  const targetUrl = `https://bbs.ruliweb.com/${prefix}/board/${boardId}/read/${articleId}`;

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

  const title = $('span.subject_text').text().trim().replace('  ', '');

  const reference = $('div.source_url a').attr('href');
  const contents = $('div.board_main_view .view_content p').map((i, item) => {
    const _$ = $(item);
    const text = _$.text().trim();
    const isImg = _$.has('img').length === 1;
    const isEmbeded = _$.has('iframe').length === 1;
    if ((!isImg && !isEmbeded) && (text === '<br />' || text === '' || text === '&nbsp;')) return;

    let content;
    let type;
    if (isEmbeded) {
      type = 'object';
      content = $('iframe', item).attr('src');
    } else if (isImg) {
      type = 'image';
      content = $('img', item).attr('src');
    } else {
      type = 'text';
      content = text;
    }
    return {
      type,
      key: i,
      content,
    };
  }).get();
  const likes = $('span.like_value').text();
  const comments = $('strong.reply_count').text().trim();

  return {
    title,
    contents,
    reference,
    comments,
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

export const getDetailTitle = createSelector(
  [getDetail],
  detail => detail.title,
);

export const getDetailContent = createSelector(
  [getDetail],
  detail => detail.contents,
);

const initState = {};

const actionHandler = {
  [actionType.REQUEST_DETAIL]: (state, { payload }) => {
    const { prefix, boardId, articleId } = payload;
    return { boardId, prefix, articleId };
  },
  [actionType.REQUEST_DETAIL_DONE]: (state, { payload }) => {
    const { boardId, prefix, articleId } = state;
    return { boardId, prefix, articleId, ...payload };
  }
};

export default function reducer(state = initState, action = {}) {
  const handler = actionHandler[action.type];
  return handler ? handler(state, action) : state;
}
