import { put, call, takeLatest, take, race } from 'redux-saga/effects';
import { createSelector } from 'reselect';
import { Alert } from 'react-native';
import { Actions as boardAction } from './boards';
// import { Actions as LoadingAction } from './loading';
import { createAction, ActionsUnion } from '../helpers';
import { getComments } from './comments';
import { parseDetail } from '../../utils/parser';

/* Actions */

export const REQUEST_DETAIL = 'REQUEST_DETAIL';
export const REQUEST_DETAIL_DONE = 'REQUEST_DETAIL_DONE';
export const UPDATE_COMMENT = 'UPDATE_COMMENT';
export const UPDATE_COMMENT_DONE = 'UPDATE_COMMENT_DONE';

export const Actions = {
  requestDetail: (prefix: string, boardId: string, articleId: string) =>
    createAction(REQUEST_DETAIL, { prefix, boardId, articleId }),

  updateComment: (prefix: string, boardId: string, articleId: string) =>
    createAction(UPDATE_COMMENT, { prefix, boardId, articleId }),

  requestDetailDone: (payload: any) => createAction(REQUEST_DETAIL_DONE, payload),
  updateCommentDone: (payload: any) => createAction(UPDATE_COMMENT_DONE, payload),
};
export type Actions = ActionsUnion<typeof Actions>;

/* Selectors */

export const getDetail = state => state.detail;

export const getDetailInfo = createSelector(
  [getDetail],
  detail => detail,
);

/* Sagas */

async function getDetailData(prefix, boardId, articleId) {
  const targetUrl =
    `http://bbs.ruliweb.com/${prefix}/board/${boardId}/read/${articleId}?search_type=name&search_key=%2F%2F%2F`;
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

  try {
    // @ts-ignore
    const response = await fetch(targetUrl, config);
    const htmlString = await response.text();

    return parseDetail(htmlString);
  } catch (e) {
    Alert.alert('error', '해당 글이 존재하지 않습니다.');
  }
}

export function* requestDetailSaga({ payload }: ReturnType<typeof Actions.requestDetail>) {
  const { prefix, boardId, articleId } = payload;
  // yield put(showLoading());

  const json = yield call(getDetailData, prefix, boardId, articleId);

  if (json) {
    yield put(Actions.requestDetailDone(json));
  } else {
    // yield put({
    //   type: boardAction.DELETE_BOARD_ITEM,
    //   payload: `${prefix}_${boardId}_${articleId}`,
    // });
  }

  // yield put(hideLoading());
}

export function* updateCommentSaga({ payload }: ReturnType<typeof Actions.updateComment>) {
  const json = yield call(getComments, payload);
  if (!json) return;

  yield put(Actions.requestDetailDone(json));
}

export const detailSaga = [
  takeLatest(REQUEST_DETAIL, requestDetailSaga),
  takeLatest(UPDATE_COMMENT, updateCommentSaga),
];

/* Reducer */

export interface DetailState {
  readonly prefix?: string;
  readonly boardId?: string;
  readonly articleId?: string;
  readonly loading?: boolean;
  readonly commentList?: any[];
  readonly bestCommentList?: any[];
}

const initState: DetailState = {};

export default function reducer(state = initState, action: Actions) {
  switch (action.type) {
    case REQUEST_DETAIL:
      const { prefix, boardId, articleId } = action.payload;
      return { boardId, prefix, articleId, loading: true };
    case REQUEST_DETAIL_DONE:
      return { ...state, ...action.payload };
    case UPDATE_COMMENT:
      return { ...state, loading: true };
    case UPDATE_COMMENT_DONE:
      const { payload } = action;
      return { ...state, commentList: payload.commentList, bestCommentList: payload.bestCommentList };
    default:
      return state;
  }
}
