import { put, call, takeLatest } from 'redux-saga/effects';
import Realm from 'realm';
import { createSelector } from 'reselect';
import { Alert } from 'react-native';
import { Actions as BoardAction } from './boards';
import { Actions as CommentAction } from './comments';
import { createAction, ActionsUnion } from '../helpers';
import parsePost from '../../utils/parsePost';
import { CommentSchema } from './comments';

/* Actions */
export const REQUEST = 'post/REQUEST';
export const ADD = 'post/ADD';
export const REMOVE = 'post/REMOVE';

export const Actions = {
  request: (prefix: string, boardId: string, id: string, update?: boolean) =>
    createAction(REQUEST, { prefix, boardId, id, update }),

  add: (payload: { contents: ContentRecord[], header: any, source?: string }) =>
    createAction(ADD, payload),
  remove: (key: string) => createAction(REMOVE, key),
};
export type Actions = ActionsUnion<typeof Actions>;

/* Selectors */

export const getPost = (state: any): DetailState => state.posts;

export const getPostInfo = createSelector(
  [getPost],
  detail => ({
    id: detail.id,
    prefix: detail.prefix,
    boardId: detail.boardId,
    meta: detail.meta,
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

/* Realm */

export const PostSchema = {
  name: 'Post',
  primaryKey: 'key',
  properties: {
    key: 'string',
    header: 'string',
    source: 'string?',
    comments: {
      type: 'list',
      objectType: 'Comment',
    },
    contents: {
      type: 'list',
      objectType: 'Content',
    },
  },
}

const ContentSchema = {
  name: 'Content',
  properties: {
    key: 'string',
    type: 'string',
    content: 'string',
    style: 'string?',
  },
}

const schemaList = [PostSchema, CommentSchema, ContentSchema];

function convert(data: any) {
  const contents = Array.from(data.contents);
  const comments = Array.from(data.comments);
  const header = JSON.parse(data.header);
  return {
    ...data,
    header,
    contents,
    comments,
  };
}

async function load(key: string) {
  return new Promise((res, rej) => {
    try {
      const realm = new Realm({ schema: schemaList });
      const data = realm.objects('Post').filtered('key == $0', key);
      if (data.length) {
        res(convert(data[0]));
        return;
      }
      res();
    } catch (e) {
      rej(e);
    }
  });
}

async function save(key: string, data: any) {
  return new Promise((res, rej) => {
      try {
        const realm = new Realm({ schema: schemaList });
        realm.write(() => {
          const header = JSON.stringify(data.header);
          const input = {
            key,
            header,
            contents: data.contents,
            source: data.source,
            comments: data.comments,
          };
          const response = realm.create('Post', input);
          res(convert(response));
        });
      } catch (e) {
        rej(e);
      }
    }
  );
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
  console.log(targetUrl);
  // @ts-ignore
  const response = await fetch(targetUrl, config);
  const htmlString = await response.text();

  return parsePost(htmlString);
}

export function* requestDetailSaga({ payload }: ReturnType<typeof Actions.request>) {
  const { prefix, boardId, id } = payload;
  const key = `${prefix}_${boardId}_${id}`;

  try {
    let data = yield call(load, key);
    if (!data) {
      console.log('download!');
      const json = yield call(getPostDetail, prefix, boardId, id);
      data = yield call(save, key, json);
    }

    const rest = { header: data.header, source: data.source, contents: data.contents  };
    const comment = data.comments;

    yield put(Actions.add(rest));
    if (comment.length) {
      yield put(CommentAction.add(comment));
    }
  } catch (e) {
    console.log(e);
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
    subject: string;
    userName: string;
    userId: string;
    level?: number;
    exp?: number;
    age?: number;
    image?: string;
  }>;
  readonly source?: string;
  readonly contents: ContentRecord[];
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
      const { contents, header, source } = action.payload;
      return { ...state, contents, meta: header, source, loading: false };
    default:
      return state;
  }
}
