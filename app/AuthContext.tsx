import React, { Children, createContext, useReducer } from 'react';
import { createAction, ActionsUnion } from './utils/createAction';

interface State {
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

interface AuthContext extends State {
  dispatch: () => void;
}

export const Actions = {
  login: (userInfo: State['userInfo']) => createAction('LOGIN', userInfo),
  clear: () => createAction('CLEAR'),
};
export type Actions = ActionsUnion<typeof Actions>;

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

function reducer(state: State, action: Actions) {
  switch (action.type) {
    case 'LOGIN': {
      return { userInfo: action.payload, isLogined: true, lastLogined: Date.now() };
    }
    case 'CLEAR': {
      return initState;
    }
    default: {
      return state;
    }
  }
}

// @ts-ignore
const AuthContext = createContext<AuthContext>({});

export function AuthProvider({ children }: any) {
  const [state, dispatch] = useReducer(reducer, initState);
  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {Children.only(children)}
    </AuthContext.Provider>
  );
}

export default AuthContext;
