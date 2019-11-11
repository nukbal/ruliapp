declare module '*.txt';
declare type ActionCallback<T = any> = (error?: boolean, json?: any) => void;


declare interface LinkType {
  prefix: string;
  boardId: string;
  id?: string;
  params?: any;
}

declare interface BoardRecord {
  key: string;
  title: string;
  posts: List<PostRecord>;
  notice: List<PostRecord>;
  updated?: Date;
}

declare interface UserRecord {
  name: string;
  id: string;
  level?: number;
  experience?: number;
  age?: number;
  image?: string;
}

declare interface PostItemRecord {
  key: string;
  url: string;
  subject: string;
  user: { name: string };
  likes?: number;
  dislikes?: number;
  views: number;
  commentSize?: number;
  date?: Date;
  hasDetail?: boolean;
}

declare interface PostDetailRecord extends PostItemRecord {
  user: UserRecord;
  contents: Array<ContentRecord | ContentRecord[]>;
  comments: CommentRecord[];
  source?: string;
}

declare interface CommentRecord {
  key: string;
  child?: string;
  reply?: string;
  best?: boolean;
  content: string;
  user: UserRecord;
  image?: string;
  time?: Date;
  likes: number;
  dislike: number;
  isDeleted?: boolean;
}

declare interface ContentRecord {
  key: string;
  type: 'image' | 'object' | 'text' | 'reference' | 'video';
  style?: any;
  content: string;
  /** only on image */
  size?: { width: number, height: number };
}
