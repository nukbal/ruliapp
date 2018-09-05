import { put, call, takeLatest } from 'redux-saga/effects';
import { createSelector } from 'reselect';
import { Alert } from 'react-native';
import { Actions as BoardAction } from './boards';
import { Actions as CommentAction } from './comments';
import { createAction, ActionsUnion } from '../helpers';
import parsePost from '../../utils/parsePost';
import realm from '../realm';

/* Actions */

export const REQUEST = 'post/REQUEST';
export const ADD = 'post/ADD';
export const REMOVE = 'post/REMOVE';
export const ERROR = 'post/ERROR';

export const Actions = {
  request: (prefix: string, boardId: string, id: string, update?: boolean) =>
    createAction(REQUEST, { prefix, boardId, id, update }),

  add: (payload: PostRecord) =>
    createAction(ADD, payload),
  remove: (key: string) => createAction(REMOVE, key),
  error: () => createAction(ERROR),
};
export type Actions = ActionsUnion<typeof Actions>;

/* Selectors */

export const getPost = (state: any): PostState => state.posts;

export const getPostInfo = createSelector(
  [getPost],
  ({ id, prefix, boardId, subject, user, likes, dislikes, commentSize }) => ({
    id,
    prefix,
    boardId,
    subject,
    user,
    likes,
    dislikes,
    commentSize,
  }),
);

export const getContents = createSelector(
  [getPost],
  detail => detail.contents,
);

export const isLoading = createSelector(
  [getPost],
  detail => detail.loading,
);

export const isError = createSelector(
  [getPost],
  detail => detail.error,
);

/* Realm queries */

function convert(data: any) {
  const { contents, comments, user, ...rest } = data;
  const contentKeys = contents.map((item: any) => item.key);
  const commentKeys = comments.map((item: any) => item.key);
  return {
    ...rest,
    contents: contentKeys,
    comments: commentKeys,
  };
}

function load(key: string) {
  return new Promise((res, rej) => {
    try {
      const data = realm.objectForPrimaryKey('Post', key);
      // @ts-ignore
      if (data && data.finished) {
        res(convert(data));
        return;
      }
      res();
    } catch (e) {
      rej(e);
    }
  });
}

function save(key: string, data: any) {
  return new Promise((res, rej) => {
      try {
        realm.write(() => {
          const old = realm.objectForPrimaryKey('Post', key);
          if (old && old.user.id !== data.user.id) {
            realm.delete(old.user);
          }
          const input = {
            key,
            subject: data.subject,
            user: data.user,
            contents: data.contents,
            comments: data.comments,
            finished: true,
          };
          const response = realm.create('Post', input, true);
          res(convert(response));
        });
      } catch (e) {
        rej(e);
      }
    }
  );
}

function remove(key: string) {
  return new Promise((res, rej) => {
    try {
      const data = realm.objectForPrimaryKey('Post', key);
      realm.write(() => {
        realm.delete(data);
        res();
      });
    } catch (e) {
      rej(e);
    }
  });
}

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
  // @ts-ignore
  const response = await fetch(targetUrl, config);
  const htmlString = await response.text();

  return parsePost(htmlString, `${prefix}_${boardId}_${id}`);
}

export function* requestDetailSaga({ payload }: ReturnType<typeof Actions.request>) {
  const { prefix, boardId, id } = payload;
  const key = `${prefix}_${boardId}_${id}`;

  try {
    let data = yield call(load, key);
    if (!data) {
      const json = yield call(getPostDetail, prefix, boardId, id);
      data = yield call(save, key, json);
    }

    const { comments, ...rest } = data;

    yield put(Actions.add(rest));
    yield put(CommentAction.add(data.comments));

  } catch (e) {
    console.warn(e.message);

    yield call(remove, key);
    yield put(BoardAction.remove(key));
    Alert.alert('error', '해당 글이 존재하지 않습니다.');
  }
}

export const postSagas = [
  takeLatest(REQUEST, requestDetailSaga),
];

/* Reducer */

export interface PostState extends PostRecord {
  readonly contents: string[];
  readonly loading: boolean;
  readonly error: boolean;
}

const initState: PostState = {
  key: '',
  prefix: '',
  boardId: '',
  id: '',
  subject: '',
  user: { id: '', name: '' },
  contents: [],
  loading: false,
  error: false,
};

export default function reducer(state = initState, action: Actions) {
  switch (action.type) {
    case REQUEST: {
      const { prefix, boardId, id, update } = action.payload;
      if (update) return { ...state, loading: true };
      return { ...initState, boardId, prefix, id, loading: true };
    }
    case ADD: {
      return { ...state, ...action.payload, loading: false, error: false };
    }
    case ERROR: {
      return { ...state, error: true };
    }
    default:
      return state;
  }
}
