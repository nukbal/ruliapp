import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import arrayToObject from 'utils/arrayToObject';
import { RootState } from '.';

const emptyPost: PostDetailRecord = {
  key: '',
  url: '',
  subject: '',
  user: { id: '', name: '' },
  views: 0,
  contents: [],
  comments: [],
};

interface PostState {
  [url: string]: PostDetailRecord;
}

const initialState: PostState = {};

const { reducer, actions } = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setPosts(state, action: PayloadAction<PostDetailRecord[]>) {
      const obj = arrayToObject(action.payload);
      return { ...state, ...obj };
    },
    setPost(state, action: PayloadAction<PostDetailRecord>) {
      const key = action.payload.url;
      state[key] = action.payload;
    },
    updatePostFromBoard(state, action: PayloadAction<PostItemRecord[]>) {
      action.payload.forEach((item) => {
        const key = item.url;
        if (state[key]) {
          state[key].commentSize = item.commentSize;
          state[key].views = item.views;
          state[key].likes = item.likes;
          state[key].date = item.date;
          state[key].subject = item.subject;
        }
      });
    },
    setComments(state, action: PayloadAction<{ key: string, comments: PostDetailRecord['comments'] }>) {
      const { key, comments } = action.payload;
      const old = state[key] ? state[key].comments : [];
      const oldKeys = old.map((item) => item.key);
      const obj = { ...arrayToObject(old), ...arrayToObject(comments) };
      const keys = Array.from(new Set([...oldKeys, ...comments.map((item) => item.key)]));

      state[key].comments = keys.map((k) => obj[k]);
      state[key].commentSize = Math.max(state[key].commentSize || 0, state[key].comments.length);
    },
  },
});

export const getPostState = (state: RootState) => state.post;
export const getPostKeys = createSelector(getPostState, (posts) => Object.keys(posts));
export const getPost = (key: string) => createSelector(
  getPostState,
  (posts) => posts[key] || emptyPost,
);

export const { setPost, setPosts, setComments, updatePostFromBoard } = actions;
export default reducer;
