import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import arrayToObject from '../utils/arrayToObject';
import { RootState } from '.';

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

const initialState: PostState = {};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setPost(state, action: PayloadAction<PostDetailRecord>) {
      const data = state[action.payload.url] || emptyPost;
      const user = Object.assign(data.user, action.payload.user);
      state[action.payload.url] = { ...data, ...action.payload, user, hasDetail: true };
    },
    setPostList(state, action: PayloadAction<PostItemRecord[]>) {
      for (let i = 0, len = action.payload.length; i < len; i += 1) {
        const target = action.payload[i];
        if (state[target.url] && state[target.url].hasDetail) {
          state[target.url] = { ...state[target.url], ...target, user: { ...state[target.url].user, ...target.user } };
        } else {
          state[target.url] = { ...emptyPost, ...target };
        }
      }
    },
    setComments(state, action: PayloadAction<{ key: string, comments: PostDetailRecord['comments'] }>) {
      const { key, comments } = action.payload;
      const old = state[key] ? state[key].comments : [];
      const oldKeys = old.map((item) => item.key);
      const obj = { ...arrayToObject(old), ...arrayToObject(comments) };
      const keys = Array.from(new Set([...oldKeys, ...comments.map((item) => item.key)]));
      state[key].comments = keys.map((k) => obj[k]);
    },
  },
});

export const getPostState = (state: RootState) => state.post;
export const getPost = (key: string) => createSelector(
  getPostState,
  (posts) => posts[key] || emptyPost,
);

export const { setPost, setPostList, setComments } = postSlice.actions;
export default postSlice.reducer;
