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
export const getPostKeys = createSelector(getPostState, (posts) => Object.keys(posts));
export const getPost = (key: string) => createSelector(
  getPostState,
  (posts) => posts[key] || emptyPost,
);

// export const fetchPost = (
//   url: string,
//   isBookmark: boolean,
// ) => async (dispatch) => {
//   await fetch();
//   dispatch(actions.setPost());
// };

export const { setPost, setPosts, setComments } = actions;
export default reducer;
