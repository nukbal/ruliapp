import { useState, useEffect } from 'react';
import { downloadFile, exists, stopDownload, moveFile } from 'react-native-fs';

export default function useCachedFile(url: string, cacheDir: string) {
  const [path, setPath] = useState('');

  useEffect(() => {
    if (!url || !cacheDir) return;
    let id = null as number | null;
    async function init() {
      try {
        const filename = `${cacheDir}/${url.replace('.mp4', '').replace(/[./:]/g, '')}.mp4`;
        const fileExists = await exists(filename);
        if (fileExists) {
          setPath(filename);
          return;
        }

        const cacheFilename = `${filename}.cache`;
        const { jobId, promise } = downloadFile({
          fromUrl: url,
          toFile: cacheFilename,
        });
        id = jobId;
        const { statusCode } = await promise;
        id = null;
        if (statusCode < 400) {
          await moveFile(cacheFilename, filename);
          setPath(filename);
        }
      } catch (e) {
        console.log(e.message);
      }
    }
    init();
    return () => {
      if (id) {
        stopDownload(id);
      }
    };
  }, [url, cacheDir]);

  return path;
}
