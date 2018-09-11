import fs from 'react-native-fs';
import { Image } from 'react-native';
import realm from '../../models/realm';
// @ts-ignore
import nanoid from 'nanoid/non-secure';

const cachePath = fs.CachesDirectoryPath;

interface ImageType {
  url: string;
  path: string;
  finished: boolean;
  width: number;
  height: number;
}

function load(url: string): Promise<ImageType> {
  return new Promise((res, rej) => {
    try {
      const data = realm.objectForPrimaryKey<ImageType>('Image', url);
      let response;
      // @ts-ignore
      if (data) response = data;
      res(response);
    } catch (e) {
      rej(e);
    }
  });
}

function save(input: any & { url: string }): Promise<ImageType> {
  return new Promise((res, rej) => {
    try {
      realm.write(() => {
        const result = realm.create<ImageType>('Image', input, true);
        res(result);
      });
    } catch (e) {
      rej(e);
    }
  });
}

function getImageSize(path: string): Promise<{ width: number, height: number }> {
  return new Promise((res, rej) => {
    Image.getSize(path, (width, height) => res({ width, height }), rej);
  });
}

function onError(e: any, id?: number) {
  console.warn(e);
  if (id) fs.stopDownload(id);
}

type startCallback = (path: string, layout?: { width: number, height: number }) => void;
type updateCallback = (percent: number) => void;

const fileNameRegex = new RegExp('\.(gif|jpg|jpeg|tiff|png|webp)$', 'i');

export default async function loader(url: string, start?: startCallback, update?: updateCallback) {
  const imgPath = `${cachePath}/images`
  const exists = await fs.exists(imgPath);
  if (!exists) {
    await fs.mkdir(imgPath);
  }

  const init = await load(url);
  if (init && init.finished) return init;
  let path: string;
  let id: number | undefined;
  let total = 0;
  
  if (init && init.path) {
    path = init.path;
  } else if (fileNameRegex.test(url)){
    const ext = url.substring(url.lastIndexOf('.') + 1, url.length);
    path = `${imgPath}/${nanoid()}.${ext}`;
  } else {
    path = `${imgPath}/${nanoid()}.jpg`
  }

  try {
    const config: fs.DownloadFileOptions = {
      fromUrl: url,
      toFile: path,
      begin: async ({ statusCode, contentLength }) => {
        if (statusCode < 400) {
          total = contentLength;
          try {
            const data = await save({ url, path });
            if (start && data) start(path);
          } catch (e) {
            onError(e, id);
          }
        }
      },
      progress: ({ bytesWritten }) => {
        if (update) {
          const percent = Math.round((bytesWritten / total) * 100);
          update(percent);
        }
      }
    };

    const { jobId, promise } = fs.downloadFile(config);
    id = jobId;
    const response = await promise;
    if (response.statusCode < 400) {
      const layout = await getImageSize(path);
      const data = await save({ url, path, finished: true, width: layout.width, height: layout.height });
      return data;
    }
  } catch (e) {
    onError(e, id);
  }
}

