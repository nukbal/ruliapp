declare module '*.txt';

declare module 'react-navigation-tabs' {
  import * as all from 'react-navigation';
  const createBottomTabNavigator = all.createBottomTabNavigator;
}
declare module 'react-navigation-stack' {
  import * as all from 'react-navigation';
  const createStackNavigator = all.createStackNavigator;
}

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
  updated: Date;
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
  comments: List<CommentRecord>;
  contents: List<ContentRecord>;
  finished?: boolean;
  updated: Date;
}

declare interface CommentRecord {
  key: string;
  child?: string;
  best?: boolean;
  content: string;
  user: UserRecord;
  image?: string;
  user: UserRecord;
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
