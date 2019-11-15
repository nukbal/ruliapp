import { createSelector } from 'reselect';
import { createAction, ActionsUnion } from '../utils/createAction';
import arrayToObject from '../utils/arrayToObject';

export const SET_POST = 'post/SET';
export const SET_POST_LIST = 'post/SET_LIST';
export const SET_COMMENT = 'post/SET_COMMENT';

export const Actions = {
  set: (url: string, post: PostDetailRecord) => createAction(SET_POST, { ...post, url }),
  setComment:
    (key: string, comments: PostDetailRecord['comments']) => createAction(SET_COMMENT, { key, comments }),
  setList: (list: PostItemRecord[]) => createAction(SET_POST_LIST, list),
};
export type Actions = ActionsUnion<typeof Actions>;


export const getPostState = (state: any) => state.post as typeof initialState;
export const getPost = (key: string) => createSelector(
  [getPostState],
  (posts) => posts[key] || emptyPost,
);
export const getPostUser = (key: string) => createSelector(
  [getPost(key)],
  (post) => post.user,
);
export const getPostMeta = (key: string) => createSelector(
  [getPost(key)],
  (post) => ({
    dislikes: post.dislikes,
    likes: post.likes,
    commentSize: post.commentSize,
  }),
);

const emptyPost: PostDetailRecord = {
  key: '',
  url: '',
  subject: '',
  user: { id: '', name: '' },
  views: 0,
  contents: [],
  comments: [],
  hasDetail: false,
};

interface PostState {
  [url: string]: PostDetailRecord;
}

const initialState: PostState = {
};

export default function reducer(state = initialState, action: Actions) {
  switch (action.type) {
    case SET_POST: {
      const data = state[action.payload.url] || emptyPost;
      return {
        ...state,
        [action.payload.url]: {
          ...data,
          ...action.payload,
          hasDetail: true,
        },
      };
    }
    case SET_COMMENT: {
      const { key, comments } = action.payload;
      const old = state[key] || emptyPost;
      const oldKeys = old.comments.map((item) => item.key);
      const obj = { ...arrayToObject(old.comments), ...arrayToObject(comments) };
      const keys = Array.from(new Set([...oldKeys, ...comments.map((item) => item.key)]));
      const newComments = keys.map((k) => obj[k]);
      return { ...state, [key]: { ...old, comments: newComments } };
    }
    case SET_POST_LIST: {
      const list = { ...state };
      for (let i = 0, len = action.payload.length; i < len; i += 1) {
        const target = action.payload[i];
        if (list[target.url] && list[target.url].hasDetail) {
          // @ts-ignore
          list[target.url] = { ...list[target.url], ...target };
        } else {
          // @ts-ignore
          list[target.url] = { ...emptyPost, ...target };
        }
      }
      return list;
    }
    default: {
      return state;
    }
  }
}
