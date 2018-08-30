import fs, { DownloadBeginCallbackResult, DownloadProgressCallbackResult } from 'react-native-fs';
import realm from '../../store/realm';
// @ts-ignore
import nanoid from 'nanoid/non-secure';

const cachePath = fs.CachesDirectoryPath;

async function load(url: string) {
  return new Promise((res, rej) => {
    try {
      const data = realm.objectForPrimaryKey('Image', url);
      let response;
      // @ts-ignore
      if (data && data.finished) response = data;
      res(response);
    } catch (e) {
      rej(e);
    }
  });
}

async function save(input: any) {
  return new Promise((res, rej) => {
    try {
      realm.write(() => {
        const data = realm.create('Image', input, true);
        res(data);
      });
    } catch (e) {
      rej(e);
    }
  });
}

type startCallback = (path: string) => void;
type updateCallback = (percent: number) => void;

export default async function loader(url: string, start?: startCallback, update?: updateCallback) {
  const data = await load(url);
  if (data) return data;

  const fileName = nanoid();
  const ext = url.substring(url.lastIndexOf('.') + 1, url.length);
  const targetUrl = `${cachePath}/${fileName}.${ext}`;
  let id: number | undefined;
  let total = 0;

  function error() {
    if (id) fs.stopDownload(id);
  }

  function begin({ jobId, statusCode, contentLength }: DownloadBeginCallbackResult) {
    if (statusCode < 400) {
      id = jobId;
      try {
        total = contentLength;
        realm.write(() => {
          const data = realm.create('Image', { url, path: targetUrl }, true);
          if (start && data) start(targetUrl);
        });
      } catch (e) {
        console.log(e);
        error();
      }
    }
  }

  function progress({ bytesWritten }: DownloadProgressCallbackResult) {
    if (update) {
      const percent = Math.round((bytesWritten / total) * 100);
      update(percent);
    }
  }

  try {
    const response = await fs.downloadFile({ fromUrl: url, toFile: targetUrl, begin });
    // @ts-ignore
    if (response.statusCode < 400) {
      const result = await save({ url, path: targetUrl, finished: true });
      return result;
    }
  } catch (e) {
    error();
  }
}

