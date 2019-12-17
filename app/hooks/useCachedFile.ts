import { useState, useEffect } from 'react';
import { downloadFile, exists, stopDownload, moveFile, mkdir } from 'react-native-fs';
import { CACHE_PATH } from '../config/constants';
import compress from '../utils/compressUrl';

let isLoaded = false;
const cache = {} as { [url: string]: number };

async function download(url: string, onProgress?: (interval: number) => void) {
  if (!isLoaded) {
    const isExists = await exists(CACHE_PATH);
    if (!isExists) await mkdir(CACHE_PATH);
    isLoaded = true;
  }

  const name = compress(url);

  const filename = `${CACHE_PATH}/${name}`;
  const fileExists = await exists(filename);
  if (fileExists) {
    return filename;
  }

  const cacheFilename = `${filename}.cache`;
  const { jobId, promise } = downloadFile({
    fromUrl: url!,
    toFile: cacheFilename,
    progress: (e) => {
      if (onProgress && e.jobId === cache[url]) {
        onProgress(e.bytesWritten / e.contentLength);
      }
    },
  });
  cache[url] = jobId;

  const { statusCode } = await promise;
  delete cache[url];

  if (statusCode < 400) {
    await moveFile(cacheFilename, filename);
    return filename;
  } else {
    throw new Error(`failed to download with status : ${statusCode}`);
  }
}

export default function useCachedFile(url?: string, enableProgress: boolean = true): [string, number, string] {
  const [path, setPath] = useState('');
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!url) return;
    download(url, enableProgress ? setProgress : undefined)
      .then((filename) => filename && setPath(filename))
      .catch((e) => setError(e.message));
    return () => {
      if (cache[url]) stopDownload(cache[url]);
    };
  }, [url, enableProgress]);

  return [path, progress, error];
}
