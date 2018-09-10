
declare module '*.txt';

/** Flux Standars Action */
declare interface FSA<T extends string, P = undefined, M = undefined> {
  type: T;
  payload: P;
  meta: M;
  error?: boolean;
}

declare interface LinkType {
  prefix: string;
  boardId: string;
  id?: string;
  params?: any;
}

declare interface UserRecord {
  id: string;
  name: string;
  level?: number;
  experience?: number;
  age?: number;
  image?: string;
}

declare interface PostRecord {
  key: string;
  prefix: string;
  boardId: string;
  id: string;
  subject: string;
  user: UserRecord;
  views?: number;
  likes?: number;
  dislikes?: number;
  commentSize?: number;
  date?: Date;
  isNotice?: boolean;
}

declare interface CommentRecord {
  key: string;
  child?: string;
  best?: boolean;
  content: string;
  user: UserRecord;
  image?: string;
  userIp?: string;
  time?: Date;
  likes: number;
  dislike: number;
}

declare interface UserRecord {
  id: string;
  name: string;
  level?: string;
  experience?: string;
  age?: string;
  image?: string;
  ip?: string;
}

declare interface ContentRecord {
  key: string;
  type: 'image' | 'object' | 'text' | 'reference';
  style?: any;
  content: string;
  order?: number;
}

declare interface AppState {
  readonly boards: any;
  readonly detail: any;
  readonly comments: any;
  readonly loading: any;
}
