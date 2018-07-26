import { put, call, takeLatest } from 'redux-saga/effects';
import { createSelector } from 'reselect';
import { Alert } from 'react-native';
// import { Actions as boardAction } from './boards';
import { createAction, ActionsUnion } from '../helpers';
import { parseDetail } from '../../utils/parser';

/* Actions */

export const REQUEST = 'detail/REQUEST';
export const ADD = 'detail/ADD';

export const Actions = {
  request: (prefix: string, boardId: string, articleId: string) =>
    createAction(REQUEST, { prefix, boardId, articleId }),

  add: (payload: any) => createAction(ADD, payload),
};
export type Actions = ActionsUnion<typeof Actions>;

/* Selectors */

export const getDetail = (state: any): DetailState => state.detail;

export const getDetailInfo = createSelector(
  [getDetail],
  detail => detail,
);

/* Sagas */

async function getDetailData(prefix: string, boardId: string, articleId: string) {
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

export function* requestDetailSaga({ payload }: ReturnType<typeof Actions.request>) {
  const { prefix, boardId, articleId } = payload;
  // yield put(showLoading());

  const json = yield call(getDetailData, prefix, boardId, articleId);

  if (json) {
    yield put(Actions.add(json));
  } else {
    // yield put({
    //   type: boardAction.DELETE_BOARD_ITEM,
    //   payload: `${prefix}_${boardId}_${articleId}`,
    // });
  }

  // yield put(hideLoading());
}

export const detailSaga = [
  takeLatest(REQUEST, requestDetailSaga),
];

/* Reducer */

export interface DetailState {
  readonly prefix?: string;
  readonly boardId?: string;
  readonly articleId?: string;
  readonly meta: Readonly<{
    userName: string;
    userId: string;
    level?: number;
    exp?: number;
    age?: number;
    avatarUrl?: string;
  }>;
  readonly contents: Readonly<ContentType[]>;
  readonly loading: boolean;
}

const initState: DetailState = { contents: [], loading: false };

export default function reducer(state = initState, action: Actions) {
  switch (action.type) {
    case REQUEST:
      const { prefix, boardId, articleId } = action.payload;
      return { boardId, prefix, articleId, loading: true };
    case ADD:
      return { ...state, ...action.payload, loading: false };
    default:
      return state;
  }
}
