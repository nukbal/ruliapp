import { put, call, takeLatest, take, race } from 'redux-saga/effects';
import { createSelector } from 'reselect';
import arrayToObject from '../../utils/arrayToObject';
import { parseComment } from '../../utils/parser';
import { createAction, ActionsUnion } from '../helpers';

/* Actions */

export const REQUEST_COMMENTS = 'REQUEST_COMMENTS';
export const REQUEST_COMMENTS_DONE = 'REQUEST_COMMENTS_DONE';
export const UPDATE_COMMENTS = 'UPDATE_COMMENTS';
export const UPDATE_COMMENTS_DONE = 'UPDATE_COMMENTS_DONE';

export const Actions  = {
  requestComment: (prefix: string, boardId: string, articleId: string, page?: number) =>
    createAction(REQUEST_COMMENTS, { prefix, boardId, articleId, page }),

  requestCommentDone: (payload: any) => createAction(REQUEST_COMMENTS_DONE, payload),

  updateComment: (prefix: string, boardId: string, articleId: string, page?: number) =>
    createAction(UPDATE_COMMENTS, { prefix, boardId, articleId, page }),

  updateCommentDone: (payload: any) => createAction(UPDATE_COMMENTS_DONE, payload),
};
export type Actions = ActionsUnion<typeof Actions>;

/* Sagas */

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
      referer: `https://bbs.ruliweb.com/${prefix}/board/${boardId}/read/${articleId}`,
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
    }
  };
  try {
    // @ts-ignore
    const response = await fetch('http://api.ruliweb.com/commentView', config);
    const json = await response.json();
  
    if (!json.success) {
      return null;
    }
    return parseComment(json.view);
  } catch(e) {
    return null;
  }
}

/* selectors */

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

/* reducers */

const initState = {};

export default function reducer(state = initState, action: Actions) {
  switch (action.type) {
    case REQUEST_COMMENTS:
      const { prefix, boardId, articleId } = action.payload;
      return { boardId, prefix, articleId, loading: true };
    case REQUEST_COMMENTS_DONE:
      const order = action.payload.map(item => item.id);
      const comments = arrayToObject(action.payload);
      return { ...state, comments, order, loading: false };
    case UPDATE_COMMENTS:
      const listOrder = action.payload.map(item => item.id);
      const commentList = arrayToObject(action.payload);
      const newOrder = order.concat(listOrder);
      return { ...state, comments: Object.assign(comments, commentList), newOrder };
    case UPDATE_COMMENTS_DONE:
      return { ...state, loading: false };
    default:
      return state;
  }
}
