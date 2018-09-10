import qs from 'query-string';
import parseBoardList from '../utils/parseBoard';
import realm from './realm';
import { BoardRecord } from '../types';

export function load(key: string): Promise<BoardRecord> {
  return new Promise((res, rej) => {
    try {
      const board = realm.objectForPrimaryKey<BoardRecord>('Board', key);
      if (board) {
        const updatedTime = board.updated.getTime();
        const currentTime = new Date().getTime();
        if (currentTime - updatedTime < 60000) {
          res(board);
          return;
        }
      }
      res();
    } catch (e) {
      rej(e);
    }
  });
}

export function save(key: string, { title, rows, notices }: ReturnType<typeof parseBoardList>): Promise<BoardRecord> {
  return new Promise((res, rej) => {
    try {
      realm.write(() => {
        const board = realm.create<BoardRecord>('Board', { key, title, updated: new Date() }, true);
        for (let i = 0, len = rows.length; i < len; i += 1) {
          const exists = board.posts.filtered('key = $0', rows[i].key);
          if (exists.length === 0) {
            board.posts.push(rows[i]);
          }
        }
        res(board);
      });
    } catch (e) {
      rej(e);
    }
  });
}

export async function request({ prefix, boardId, params }: { prefix: string, boardId?: string, params: any }) {
  let targetUrl = `http://m.ruliweb.com/${prefix}${boardId ? `/board/${boardId}` : ''}`;

  if (params) {
    const query = qs.stringify(params);
    targetUrl += '?' + query;
  }

  const config = {
    method: 'GET',
    headers: {
      Accept: 'text/html',
      'Content-Type': 'text/html',
      'Accept-Encoding': 'gzip, deflate',
      Referer: targetUrl,
    }
  };
  const key = `${prefix}${boardId ? `_${boardId}` : ''}`;

  try {
    let data = await load(key);

    if (!data) {
      const response = await fetch(targetUrl, config);
      const htmlString = await response.text();
      const json = await parseBoardList(htmlString);
      data = await save(key, json);
    }
    const posts = data.posts.sorted('date', true).slice(0, (params.page * 30));

    return {
      title: data.title,
      posts,
    };
  } catch(e) {
    console.warn(e);
    return;
  }
}