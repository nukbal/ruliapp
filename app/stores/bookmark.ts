import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
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

interface BookMarkState {
  [url: string]: PostDetailRecord;
}
const initialState: BookMarkState = {};

const { actions, reducer } = createSlice({
  name: 'bookmark',
  initialState,
  reducers: {
    setBookmark(state, action: PayloadAction<PostDetailRecord>) {
      const record = action.payload;
      state[record.url] = record;
    },
    removeBookmark(state, action: PayloadAction<string>) {
      delete state[action.payload];
    },
  },
});

export const getBookmarks = (state: RootState) => state.bookmark;
export const getBookmarkIds = createSelector(getBookmarks, (bookmark) => Object.keys(bookmark));
export const getBookmark = (key: string) => createSelector(
  [getBookmarks],
  (bookmarks) => bookmarks[key] || null,
);

export const { setBookmark, removeBookmark } = actions;
export default reducer;
