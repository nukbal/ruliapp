import { createSelector } from 'reselect';
import { createAction, ActionsUnion } from '../utils/createAction';

export const Actions = {
  login: (userInfo: UserState['userInfo']) => createAction('LOGIN', userInfo),
  clear: () => createAction('CLEAR'),
};
export type Actions = ActionsUnion<typeof Actions>;

const getUserState = (state: any) => state.user as UserState;
export const getLoginStatus = createSelector([getUserState], (user) => user.isLogined);
export const getLastLoginTime = createSelector([getUserState], (user) => user.lastLogined);
export const getUserInfo = createSelector([getUserState], (user) => user.userInfo);
export const getUserId = createSelector([getUserInfo], (user) => user.id);

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

const initState = {
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

export default function reducer(state: UserState = initState, action: Actions) {
  switch (action.type) {
    case 'LOGIN': {
      return { userInfo: action.payload, lastLogined: Date.now(), isLogined: true };
    }
    case 'CLEAR': {
      return initState;
    }
    default: {
      return state;
    }
  }
}
