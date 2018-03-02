import { put, call, takeLatest, take, race } from 'redux-saga/effects';
import { createSelector } from 'reselect';

import { showLoading, hideLoading } from './loading';
import { arrayToObject } from '../../utils/commonUtils';
import { parseComment } from '../../utils/parser';

export const actionType = {
  REQUEST_COMMENTS: 'REQUEST_COMMENTS',
  REQUEST_COMMENTS_DONE: 'REQUEST_COMMENTS_DONE',
  UPDATE_COMMENTS: 'UPDATE_COMMENTS',
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

export async function getComments({ prefix, boardId, articleId }) {
  const form = new FormData();
  form.append('page', 1);
  form.append('article_id', articleId);
  form.append('board_id', boardId);
  form.append('cmtimg', 1);

  const config = {
    method: 'POST',
    body: form,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept-Encoding': 'gzip, deflate',
      referer: `https://m.ruliweb.com/${prefix}/board/${boardId}/read/${articleId}`,
      'User-Agent': 'Mozilla/5.0',
    }
  };

  const response = await fetch('https://api.ruliweb.com/commentView', config);
  const json = await response.json();

  if (!json.success) {
    return {
      commentList: [],
      bestCommentList: [],
    }
  }

  return parseComment(json.view);
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
  [actionType.REQUEST_COMMENTS]: (state, { payload }) => {
    const { prefix, boardId, articleId } = payload;
    return { boardId, prefix, articleId, loading: true };
  },
  [actionType.REQUEST_COMMENTS_DONE]: (state, { payload }) => {
    const { prefix, boardId, articleId } = state;
    const order = payload.map(item => item.id);
    const comments = arrayToObject(payload);
    return { boardId, prefix, articleId, comments, order };
  },
  [actionType.UPDATE_COMMENTS]: (state, { payload }) => {
    const { prefix, boardId, articleId, comments, order } = state;
    const listOrder = payload.map(item => item.id);
    const commentList = arrayToObject(payload);
    const newOrder = order.concat(listOrder);

    return { boardId, prefix, articleId, comments: Object.assign(comments, commentList), newOrder };
  }
};

export default function reducer(state = initState, action = {}) {
  const handler = actionHandler[action.type];
  return handler ? handler(state, action) : state;
}
