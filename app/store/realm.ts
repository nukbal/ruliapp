import Realm from 'realm';

export const BoardSchema = {
  name: 'Board',
  primaryKey: 'key',
  properties: {
    key: 'string',
    title: 'string',
    posts: 'Post[]',
    notice: 'Post[]',
    updated: 'date',
  }
}

export const PostSchema = {
  name: 'Post',
  primaryKey: 'key',
  properties: {
    key: 'string',
    subject: 'string',
    user: 'User',
    date: 'date?',
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
    user: 'User',
    time: 'date',
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
    level: 'int?',
    experience: 'int?',
    age: 'int?', 
    image: 'string?',
    ip: 'string?',
    posts: 'Post[]',
    comments: 'Comment[]',
  },
}

export const ImageSchema = {
  name: 'Image',
  primaryKey: 'url',
  properties: {
    url: 'string',
    path: 'string',
    finished: { type: 'bool', default: false },
    width: 'int?',
    height: 'int?',
  },
}

export const schemaList = [BoardSchema, PostSchema, CommentSchema, ContentSchema, UserSchema, ImageSchema];

const instance = new Realm({ schema: schemaList });

export default instance;
