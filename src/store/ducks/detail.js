import { put, call, takeLatest, take, race } from 'redux-saga/effects';
import { createSelector } from 'reselect';
import { Alert } from 'react-native';
import { showLoading, hideLoading } from './loading';
import { getComments } from './comments';
import { parseDetail } from '../../utils/parser';

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
  const targetUrl =
    `https://bbs.ruliweb.com/${prefix}/board/${boardId}/read/${articleId}?search_type=name&search_key=%24%24`;

  const config = {
    method: 'GET',
    credentials: 'include',
    headers: {
      Accept: 'text/html',
      'Content-Type': 'text/html',
      'Accept-Encoding': 'gzip, deflate',
      Referer: targetUrl,
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
    },
  };
  
  const response = await fetch(targetUrl, config);
  const htmlString = await response.text();

  try {
    return parseDetail(htmlString);
  } catch (e) {
    Alert.alert('error', '해당 글이 존재하지 않습니다.');
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
