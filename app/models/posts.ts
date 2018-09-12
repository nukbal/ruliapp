import { Alert } from 'react-native';
import realm from './realm';
import parsePost from '../utils/parsePost';

export function load(key: string): Promise<PostRecord> {
  return new Promise((res, rej) => {
    try {
      const data = realm.objectForPrimaryKey<PostRecord>('Post', key);
      // @ts-ignore
      if (data && data.finished) {
        res(data);
        return;
      }
      res();
    } catch (e) {
      rej(e);
    }
  });
}

export function save(key: string, data: any): Promise<PostRecord> {
  return new Promise((res, rej) => {
      try {
        realm.write(() => {
          const old = realm.objectForPrimaryKey<PostRecord>('Post', key);
          if (old && old.user.id !== data.user.id) {
            realm.delete(old.user);
          }
          const input = {
            key,
            subject: data.subject,
            user: data.user,
            contents: data.contents,
            comments: data.comments,
            finished: true,
            updated: new Date(),
          };
          const response = realm.create<PostRecord>('Post', input, true);
          res(response);
        });
      } catch (e) {
        rej(e);
      }
    }
  );
}

export function remove(key: string) {
  return new Promise((res, rej) => {
    try {
      const data = realm.objectForPrimaryKey('Post', key);
      realm.write(() => {
        realm.delete(data);
        res();
      });
    } catch (e) {
      rej(e);
    }
  });
}

export async function request({ prefix, boardId, id }: { prefix: string, boardId: string, id: string }) {
  const key = `${prefix}_${boardId}_${id}`;

  try {
    let data = await load(key);
    if (!data) {
      const targetUrl =
        `http://m.ruliweb.com/${prefix}/board/${boardId}/read/${id}?search_type=name&search_key=%2F%2F%2F`;
      const config = {
        method: 'GET',
        credentials: 'include',
        headers: {
          Accept: 'text/html',
          'Content-Type': 'text/html',
          'Accept-Encoding': 'gzip, deflate',
          Referer: targetUrl,
        },
      };
      // @ts-ignore
      const response = await fetch(targetUrl, config);
      const htmlString = await response.text();
      const json = parsePost(htmlString, `${prefix}_${boardId}_${id}`);
      data = await save(key, json);
    }

    return data;
  } catch (e) {
    console.warn(e.message);
    await remove(key);
    Alert.alert('error', '해당 글이 존재하지 않습니다.');
  }
}
