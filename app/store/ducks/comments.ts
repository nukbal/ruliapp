import { put, call, takeLatest, take, race } from 'redux-saga/effects';
import { createSelector } from 'reselect';
import arrayToObject from '../../utils/arrayToObject';
import parseComment from '../../utils/parseComment';
import { createAction, ActionsUnion } from '../helpers';

/* Actions */

export const REQUEST = 'comments/REQUEST';
export const ADD = 'comments/ADD';
export const UPDATE = 'comments/UPDATE';

export const Actions  = {
  request: (prefix: string, boardId: string, articleId: string, page?: number) =>
    createAction(REQUEST, { prefix, boardId, articleId, page }),

  add: (payload: CommentRecord[]) => createAction(ADD, payload),
  update: (payload: any) => createAction(UPDATE, payload),
};
export type Actions = ActionsUnion<typeof Actions>;

/* Realm */

/* Sagas */

// @ts-ignore
export async function requestComments({ prefix, boardId, articleId }) {
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

export const getCommentState = (state: AppState) => state.comments;

export const getComments = createSelector(
  [getCommentState],
  ({ records }) =>  records,
);

/* reducers */

export interface CommentState {
  readonly records: string[];
  readonly loading: boolean;
}

const initState: CommentState = { records: [], loading: false };

export default function reducer(state = initState, action: Actions) {
  switch (action.type) {
    case REQUEST: {
      const { prefix, boardId, articleId } = action.payload;
      return { boardId, prefix, articleId, loading: true };
    }
    case ADD: {
      return { ...state, records: action.payload, loading: false };
    }
    case UPDATE: {
      return { ...state, records: [...state.records, ...action.payload], loading: false };
    }
    default:
      return state;
  }
}
