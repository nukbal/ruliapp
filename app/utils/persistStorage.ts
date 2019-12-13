import {
  DocumentDirectoryPath,
  unlink,
  writeFile,
  readFile,
  exists,
  mkdir,
  readDir,
} from 'react-native-fs';

let isDirLoaded = false;

const baseDir = `${DocumentDirectoryPath}/redux_persist`;
function resolveFilePath(key: string) {
  return [baseDir, key.split(':').join('_')].join('/');
}

async function checkDir() {
  const isExist = await exists(baseDir);
  if (!isExist) await mkdir(baseDir);
  isDirLoaded = true;
}

export default {
  async setItem(key: string, value: string) {
    try {
      if (!isDirLoaded) await checkDir();
      const path = resolveFilePath(key);
      await writeFile(path, value);
    } catch (e) {
      console.warn('[persist.setItem] error ', e);
    }
  },
  async getItem(key: string) {
    try {
      if (!isDirLoaded) await checkDir();
      const path = resolveFilePath(key);
      const isExists = await exists(path);
      if (isExists) {
        const data = await readFile(path);
        return data;
      }
    } catch (e) {
      console.warn('[persist.getItem] error ', e);
    }
  },
  async removeItem(key: string) {
    try {
      if (!isDirLoaded) await checkDir();
      const path = resolveFilePath(key);
      const isExists = await exists(path);
      if (isExists) await unlink(path);
    } catch (e) {
      console.warn('[persist.removeItem] error ', e);
    }
  },
  async getAllKeys() {
    try {
      if (!isDirLoaded) await checkDir();
      const files = await readDir(baseDir);
      const names = files.filter((file) => file.isFile()).map((file) => file.name.split('_').join(':'));
      return names;
    } catch (e) {
      console.warn('[persist.getAllKeys] error', e);
    }
  },
};
