import Realm from 'realm';

export const PostSchema = {
  name: 'Post',
  primaryKey: 'key',
  properties: {
    key: 'string',
    subject: 'string',
    user: { type: 'linkingObjects', objectType: 'User', property: 'posts' },
    date: 'string?',
    views: { type: 'int', default: 0 },
    likes: { type: 'int', default: 0 },
    dislikes: { type: 'int', default: 0 },
    commentSize: { type: 'int', default: 0 },
    isNotice: 'bool?',
    comments: 'Comment[]',
    contents: 'Content[]',
  },
}

export const CommentSchema = {
  name: 'Comment',
  primaryKey: 'key',
  properties: {
    key: 'string',
    child: 'string?',
    best: 'bool?',
    content: 'string',
    image: 'string?',
    userId: 'string',
    userName: 'string',
    userIp: 'string?',
    time: 'string',
    likes: 'string?',
    dislike: 'string?',
  },
}

export const ContentSchema = {
  name: 'Content',
  primaryKey: 'key',
  properties: {
    key: 'string',
    type: 'string',
    content: 'string',
    style: 'string?',
  },
}

export const UserSchema = {
  name: 'User',
  primaryKey: 'id',
  properties: {
    id: 'string',
    name: 'string',
    level: 'string?',
    experience: 'string?',
    age: 'string?',
    image: 'string?',
    posts: 'Post[]',
  },
}

export const schemaList = [PostSchema, CommentSchema, ContentSchema, UserSchema];

const instance = new Realm({ schema: schemaList, deleteRealmIfMigrationNeeded: true });

export default instance;
