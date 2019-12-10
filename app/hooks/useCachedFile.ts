import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import {
  downloadFile,
  stopDownload,
  exists,
  mkdir,
} from 'react-native-fs';

import { CACHE_PATH } from 'app/config/constants';

exists(CACHE_PATH).then((exist) => {
  if (!exist) mkdir(CACHE_PATH);
});

async function pathExists(url: string): Promise<[string, boolean]> {
  const name = url.replace('.ruliweb.com', '').replace(/http?s:/i, '').split('/').join('');
  const path = [CACHE_PATH, name].join('');
  const hasFile = await exists(path);
  return [path, hasFile];
}

const prefix = Platform.OS === 'android' ? 'file://' : '';

export default function useCachedFile(url: string): [string, number, string] {
  const [path, onSuccess] = useState('');
  const [percent, onProgress] = useState(0);
  const [error, onError] = useState('');

  useEffect(() => {
    let queue: number | null = null;
    pathExists(url)
      .then(([filepath, hasFile]) => {
        if (hasFile) {
          onSuccess(prefix + filepath);
          return;
        }
        const { jobId, promise } = downloadFile({
          fromUrl: url,
          toFile: filepath,
          discretionary: true,
          progress: (e) => queue && onProgress(e.bytesWritten / e.contentLength),
          progressDivider: 5,
        });
        queue = jobId;
        promise.then(() => {
          if (queue) onSuccess(prefix + filepath);
          queue = null;
        }).catch((e) => queue && onError(e.message));
      });
    return () => {
      if (queue) stopDownload(queue);
      queue = null;
    };
  }, [url]);

  return [path, percent, error];
}
