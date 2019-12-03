import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '.';

export interface UserState {
  isLogined: boolean;
  lastLogined: number;
  userInfo: {
    /** 회원번호 */
    id: string;
    /** 이름 */
    name: string;
    /** 마크 url */
    avatar: string;
    /** 레벨 */
    level: number;
    /** 출석일수 */
    attends: number;
    /** 레벨Exp. */
    expNow: string;
    /** 필요Exp. */
    expLeft: string;

    // 활동내역
    /** 작성 게시글 */
    postCount: number;
    /** 삭제 게시글 */
    postDelCount: number;
    /** 작성 댓글 */
    commentCount: number;
    /** 삭제 댓글 */
    commentDelCount: number;
    /** 받은 추천수 */
    likeCount: number;
  };
}

const initialState: UserState = {
  isLogined: false,
  lastLogined: 0,
  userInfo: {
    id: '',
    name: '',
    avatar: '',
    level: 0,
    attends: 0,
    expNow: '',
    expLeft: '',

    postCount: 0,
    postDelCount: 0,
    commentCount: 0,
    commentDelCount: 0,
    likeCount: 0,
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login(state, action: PayloadAction<UserState['userInfo']>) {
      state.userInfo = action.payload;
      state.isLogined = true;
      state.lastLogined = Date.now();
    },
    logout() {
      return initialState;
    },
  },
});

const getUserState = (state: RootState) => state.user;
export const getLoginStatus = createSelector(getUserState, (user) => user.isLogined);
export const getLastLoginTime = createSelector(getUserState, (user) => user.lastLogined);
export const getUserInfo = createSelector(getUserState, (user) => user.userInfo);
export const getUserId = createSelector(getUserInfo, (user) => user.id);

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
