import { put, call, takeLatest } from 'redux-saga/effects';
import { createSelector } from 'reselect';
import { Alert } from 'react-native';
import { Actions as BoardAction } from './boards';
import { createAction, ActionsUnion } from '../helpers';
import parsePost from '../../utils/parsePost';

/* Actions */
export const REQUEST = 'post/REQUEST';
export const ADD = 'post/ADD';
export const REMOVE = 'post/REMOVE';

export const Actions = {
  request: (prefix: string, boardId: string, id: string, update?: boolean) =>
    createAction(REQUEST, { prefix, boardId, id, update }),

  add: (payload: ContentRecord[]) => createAction(ADD, payload),
  remove: (key: string) => createAction(REMOVE, key),
};
export type Actions = ActionsUnion<typeof Actions>;

/* Selectors */

export const getDetail = (state: any): DetailState => state.detail;

export const getDetailInfo = createSelector(
  [getDetail],
  detail => ({
    id: detail.id,
    prefix: detail.prefix,
    boardId: detail.boardId,
    meta: detail.meta,
  }),
);

export const getContents = createSelector(
  [getDetail],
  detail => detail.contents,
);

export const isLoading = createSelector(
  [getDetail],
  detail => detail.loading,
);

/* Sagas */

async function getPostDetail(prefix: string, boardId: string, id: string) {
  const targetUrl =
    `http://m.ruliweb.com/${prefix}/board/${boardId}/read/${id}?search_type=name&search_key=%2F%2F%2F`;
  const config = {
    method: 'GET',
    credentials: 'include',
    headers: {
      Accept: 'text/html',
      'Content-Type': 'text/html',
      'Accept-Encoding': 'gzip, deflate',
      Referer: targetUrl,
    },
  };
  console.log(targetUrl);
  // @ts-ignore
  const response = await fetch(targetUrl, config);
  const htmlString = await response.text();

  return parsePost(htmlString);
}

export function* requestDetailSaga({ payload }: ReturnType<typeof Actions.request>) {
  const { prefix, boardId, id } = payload;

  try {
    const json = yield call(getPostDetail, prefix, boardId, id);
    console.log(json);
    yield put(Actions.add(json));
  } catch (e) {
    yield put(BoardAction.remove(`${prefix}_${boardId}_${id}`));
    Alert.alert('error', '해당 글이 존재하지 않습니다.');
  }
}

export const postSagas = [
  takeLatest(REQUEST, requestDetailSaga),
];

/* Reducer */

export interface DetailState {
  readonly prefix?: string;
  readonly boardId?: string;
  readonly id?: string;
  readonly meta?: Readonly<{
    userName: string;
    userId: string;
    level?: number;
    exp?: number;
    age?: number;
    avatarUrl?: string;
  }>;
  readonly contents: Readonly<ContentRecord[]>;
  readonly loading: boolean;
}

const initState: DetailState = { contents: [], loading: false };

export default function reducer(state = initState, action: Actions) {
  switch (action.type) {
    case REQUEST:
      const { prefix, boardId, id, update } = action.payload;
      if (update) return { ...state, loading: true };
      return { boardId, prefix, id, loading: true };
    case ADD:
      return { ...state, contents: action.payload, loading: false };
    default:
      return state;
  }
}
