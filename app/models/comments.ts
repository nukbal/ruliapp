import { List } from 'realm';
import parseComment from '../utils/parseComment';
import realm from './realm';

function save(key: string, rows: CommentRecord[]): Promise<List<CommentRecord> | undefined> {
  return new Promise((res, rej) => {
      try {
        realm.write(() => {
          const posts = realm.objectForPrimaryKey<PostRecord>('Post', key);
          if (!posts) {
            res();
            return;
          }
          posts.updated = new Date();

          for (let i = 0, len = rows.length; i < len; i += 1) {
            const exists = posts.comments.filtered('key = $0', rows[i].key);
            if (exists.length === 0) {
              posts.comments.push(rows[i]);
            }
          }

          res(posts.comments);
        });
      } catch (e) {
        rej(e);
      }
    }
  );
}

function load(key: string): Promise<List<CommentRecord> | undefined> {
  return new Promise((res, rej) => {
    try {
      const post = realm.objectForPrimaryKey<PostRecord>('Post', key);
      if (post) {
        const updatedTime = post.updated.getTime();
        const currentTime = new Date().getTime();
        if (currentTime - updatedTime < 60000) {
          res(post.comments);
          return;
        }
      }
      res();
    } catch (e) {
      rej(e);
    }
  });
}

interface Props {
  prefix: string;
  boardId: string;
  id: string;
}

export async function request({ prefix, boardId, id }: Props) {
  const key = `${prefix}_${boardId}_${id}`;

  try {
    let data = await load(key);
    if (!data) {
      const form = new FormData();
      form.append('page', '1');
      form.append('article_id', id);
      form.append('board_id', boardId);
      form.append('cmtimg', '1');

      const targetUrl = `http://m.ruliweb.com/${prefix}/board/${boardId}/read/${id}`;
      const config = {
        method: 'POST',
        body: form,
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept-Encoding': 'gzip, deflate',
          Referer: targetUrl,
        },
      };
      // @ts-ignore
      const response = await fetch('http://api.ruliweb.com/commentView', config);
      const res = await response.json();
      if (res.success) {
        const json = parseComment(res.view);
        data = await save(key, json);
      }
    }

    return data;
  } catch (e) {
    console.warn(e.message);
  }
}
