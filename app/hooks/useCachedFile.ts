import { useState, useEffect } from 'react';
import { downloadFile, exists, stopDownload, moveFile, mkdir } from 'react-native-fs';

import { CACHE_PATH, PATH_CACHE as cache } from 'config/constants';
import compress from 'utils/compressUrl';

let isLoaded = false;
const jobqueue = {} as { [url: string]: number };

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

  if (jobqueue[url] === -1) return;

  const cacheFilename = `${filename}.cache`;
  const { jobId, promise } = downloadFile({
    fromUrl: url!,
    toFile: cacheFilename,
    headers: {
      'Accept-Ranges': 'none',
    },
    progress: (e) => {
      if (onProgress && e.jobId === jobqueue[url]) {
        onProgress(e.bytesWritten / e.contentLength);
      }
    },
  });
  jobqueue[url] = jobId;

  const { statusCode } = await promise;
  delete jobqueue[url];

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
    if (cache.has(url)) {
      const filepath = cache.get(url);
      setPath(filepath);
    } else {
      download(url, enableProgress ? setProgress : undefined)
        .then((filename) => {
          if (filename) {
            if (jobqueue[url] !== -1) setPath(filename);
            cache.set(url, filename);
          }
        })
        .catch((e) => jobqueue[url] !== -1 && setError(e.message));
    }
    return () => {
      if (jobqueue[url]) {
        stopDownload(jobqueue[url]);
        jobqueue[url] = -1;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return [path, progress, error];
}
