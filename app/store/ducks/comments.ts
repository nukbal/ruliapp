import { put, call, takeLatest, take, race } from 'redux-saga/effects';
import { createSelector } from 'reselect';
import arrayToObject from '../../utils/arrayToObject';
import { parseComment } from '../../utils/parser';
import { createAction, ActionsUnion } from '../helpers';

/* Actions */

export const REQUEST_COMMENTS = 'REQUEST_COMMENTS';
export const ADD_COMMENTS = 'ADD_COMMENTS';
export const UPDATE_COMMENTS = 'UPDATE_COMMENTS';

export const Actions  = {
  request: (prefix: string, boardId: string, articleId: string, page?: number) =>
    createAction(REQUEST_COMMENTS, { prefix, boardId, articleId, page }),

  add: (payload: any) => createAction(ADD_COMMENTS, payload),
  update: (payload: any) => createAction(UPDATE_COMMENTS, payload),
};
export type Actions = ActionsUnion<typeof Actions>;

/* Sagas */

// @ts-ignore
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

export const getBoardState = (state: any) => state.boards;

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

export interface CommentState {
  readonly boardId?: string;
  readonly prefix?: string;
  readonly articleId?: string;
  readonly comments?: any[];
  readonly loading: boolean;
  readonly order?: string[];
}

const initState: CommentState = { loading: false };

export default function reducer(state = initState, action: Actions) {
  switch (action.type) {
    case REQUEST_COMMENTS:
      const { prefix, boardId, articleId } = action.payload;
      return { boardId, prefix, articleId, loading: true };
    case ADD_COMMENTS:
      return { ...state, comments: action.payload, loading: false };
    case UPDATE_COMMENTS:
      // const listOrder = action.payload.map((item: any) => item.id);
      const commentList = arrayToObject(action.payload);
      return { ...state, comments: { ...state.comments, ...commentList }, loading: false };
    default:
      return state;
  }
}