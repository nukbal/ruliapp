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
  posts: {
    [url: string]: PostDetailRecord;
  };
  url: string;
}

const initialState: PostState = {
  posts: {},
  url: '',
};

const { reducer, actions } = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setCurrent(state, action: PayloadAction<{ url: string; ward?: boolean }>) {
      state.url = action.payload.url;
    },
    setPosts(state, action: PayloadAction<PostDetailRecord[]>) {
      const obj = arrayToObject(action.payload);
      return { ...state, ...obj };
    },
    setPost(state, action: PayloadAction<PostDetailRecord>) {
      const key = action.payload.url;
      state.posts[key] = action.payload;
    },
    updatePostFromBoard(state, action: PayloadAction<PostItemRecord[]>) {
      action.payload.forEach((item) => {
        const key = item.url;
        if (state.posts[key]) {
          state.posts[key].commentSize = item.commentSize;
          state.posts[key].views = item.views;
          state.posts[key].likes = item.likes;
          state.posts[key].date = item.date;
          state.posts[key].subject = item.subject;
        }
      });
    },
    setComments(state, action: PayloadAction<{ key: string, comments: PostDetailRecord['comments'] }>) {
      const { key, comments } = action.payload;
      const old = state.posts[key] ? state.posts[key].comments : [];
      const oldKeys = old.map((item) => item.key);
      const obj = { ...arrayToObject(old), ...arrayToObject(comments) };
      const keys = Array.from(new Set([...oldKeys, ...comments.map((item) => item.key)]));

      state.posts[key].comments = keys.map((k) => obj[k]);
      state.posts[key].commentSize = Math.max(state.posts[key].commentSize || 0, state.posts[key].comments.length);
    },
  },
});

export const getPostState = (state: RootState) => state.post;
export const getCurrentPostKey = createSelector(getPostState, ({ url }) => url);
export const getPost = createSelector(
  getPostState, getCurrentPostKey,
  ({ posts }, url) => posts[url] || emptyPost,
);

export const { setPost, setPosts, setComments, updatePostFromBoard, setCurrent } = actions;
export default reducer;
