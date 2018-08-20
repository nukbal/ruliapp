
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

declare interface BoardRecord {
  key: string;
  id: string;
  subject: string;
  author: string;
  link: LinkType;
  views?: string;
  likes?: string;
  dislike?: string;
  comments?: string;
  date?: string;
  isNotice?: boolean;
  hasImage?: boolean;
  hasYoutube?: boolean;
  categoryName?: string;
  categoryLink?: LinkType;
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
