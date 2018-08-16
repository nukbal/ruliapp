
declare module '*.txt';

/** Flux Standars Action */
declare interface FSA<T extends string, P = undefined, M = undefined> {
  type: T;
  payload: P;
  meta: M;
  error?: boolean;
}

declare interface BoardRecord {
  key: string;
  id: string;
  subject: string;
  user: string;
  views?: number;
  like?: number;
  dislike?: number;
  commentNum?: number;
  date?: string;
  isNotice?: boolean;
  hasImage?: boolean;
  hasYoutube?: boolean;
  categoryName?: string;
  categoryId?: number;
}

declare interface CommentType {
  key: string;
}

declare interface ContentType {
  key: string;
  type: string;
}

declare interface AppState {
  readonly boards: any;
  readonly detail: any;
  readonly comments: any;
  readonly loading: any;
}
