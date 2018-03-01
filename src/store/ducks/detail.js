import { put, call, takeLatest, take, race } from 'redux-saga/effects';
import { createSelector } from 'reselect';
import { showLoading, hideLoading } from './loading';
import cheerio from 'cheerio-without-node-native';

import { parseComments, parseBestComments, getComments } from './comments';

export const actionType = {
  REQUEST_DETAIL: 'REQUEST_DETAIL',
  REQUEST_DETAIL_DONE: 'REQUEST_DETAIL_DONE',
  UPDATE_COMMENT: 'UPDATE_COMMENT',
  UPDATE_COMMENT_DONE: 'UPDATE_COMMENT_DONE',
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

export function updateComment(prefix, boardId, articleId) {
  return {
    type: actionType.UPDATE_COMMENT,
    payload: {
      prefix,
      boardId,
      articleId,
    },
  }
}

async function getDetailData(prefix, boardId, articleId) {
  const targetUrl = `https://m.ruliweb.com/${prefix}/board/${boardId}/read/${articleId}`;

  const config = {
    method: 'GET',
    credentials: 'include',
    headers: {
      Accept: 'text/html',
      'Content-Type': 'text/html',
      'Accept-Encoding': 'gzip, deflate',
      Referer: targetUrl,
      'User-Agent': 'Mozilla/5.0',
    },
  };

  const response = await fetch(targetUrl, config);
  const htmlString = await response.text();

  const $ = cheerio.load(htmlString);

  let title = $('head title').text();
  title = title.substring(0, title.indexOf(' | '));

  const reference = $('div.source_url a').attr('href');
  const contents = $('div.board_main_view .view_content')[0].childNodes.map((item, i) => {
    if (item.type === 'tag' && item.name === 'br') return;

    let content;
    let type;
    if (item.type === 'tag' && (item.name === 'p' || item.name === 'div')) {
      const _$ = $(item);
      const text = _$.text().trim();
      const isImg = _$.has('img').length === 1;
      const isEmbeded = _$.has('iframe').length === 1;
      if ((!isImg && !isEmbeded) && (text === '<br />' || text === '' || text === '&nbsp;')) return;
  
      if (isEmbeded) {
        type = 'embeded';
        content = $('iframe', item).attr('src');
      } else if (isImg) {
        type = 'image';
        content = $('img', item).attr('src');
      } else {
        type = 'text';
        content = text;
      }
    } else if (item.type === 'tag' && item.name == 'img'){
      type = 'image';
      content = item.attribs.src;
    } else if (item.type === 'tag' && item.name == 'iframe') {
      type = 'embeded';
      content = item.attribs.src;
    } else if (item.type === 'tag') {
      type = 'text';
      content = $(item).text().trim();
    } else if (item.type === 'text') {
      const text = item.data.trim();
      if (text) {
        type = 'text';
        content = item.data.trim();
      } else {
        return;
      }
    }

    return {
      type,
      key: `${i}`,
      content,
    };
  }).filter(item => item);

  const likes = $('span.like_value').text();
  const comments = $('div.comment_count strong.reply_count').text().trim();

  const commentList = parseComments($);
  const bestCommentList = parseBestComments($);

  return {
    title,
    contents,
    reference,
    comments,
    likes,
    commentList,
    bestCommentList,
  }
}

export function* requestDetailSaga({ payload }) {
  const { prefix, boardId, articleId } = payload;
  // yield put(showLoading());

  const json = yield call(getDetailData, prefix, boardId, articleId);

  yield put({
    type: actionType.REQUEST_DETAIL_DONE,
    payload: json,
  });

  // yield put(hideLoading());
}

export function* updateCommentSaga({ payload }) {
  const json = yield call(getComments, payload);

  yield put({
    type: actionType.UPDATE_COMMENT_DONE,
    payload: json,
  });
}

export const detailSaga = [
  takeLatest(actionType.REQUEST_DETAIL, requestDetailSaga),
  takeLatest(actionType.UPDATE_COMMENT, updateCommentSaga),
];

export const getDetail = state => state.detail;

export const getDetailInfo = createSelector(
  [getDetail],
  detail => detail,
);

const initState = {};

const actionHandler = {
  [actionType.REQUEST_DETAIL]: (state, { payload }) => {
    const { prefix, boardId, articleId } = payload;
    return { boardId, prefix, articleId, loading: true };
  },
  [actionType.REQUEST_DETAIL_DONE]: (state, { payload }) => {
    const { boardId, prefix, articleId } = state;
    return { boardId, prefix, articleId, ...payload };
  },
  [actionType.UPDATE_COMMENT]: (state, { payload }) => {
    return { ...state, loading: true };
  },
  [actionType.UPDATE_COMMENT_DONE]: (state, { payload }) => {
    const { commentList, bestCommentList, loading, ...rest } = state;
    return { commentList: payload.commentList, bestCommentList: payload.bestCommentList, ...rest };
  }
};

export default function reducer(state = initState, action = {}) {
  const handler = actionHandler[action.type];
  return handler ? handler(state, action) : state;
}
