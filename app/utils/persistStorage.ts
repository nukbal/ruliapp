import {
  DocumentDirectoryPath,
  readDir,
  unlink,
  writeFile,
  readFile,
  exists,
} from 'react-native-fs';

const location = DocumentDirectoryPath;
const dir = 'redux_persist/';
export const baseDir = [location, dir].join('/');

export default {
  async setItem(key: string, value: string) {
    await writeFile(baseDir + encodeURIComponent(key), value, 'utf8');
  },
  async getItem(key: string) {
    const path = baseDir + encodeURIComponent(key);
    const isExists = await exists(path);
    if (!isExists) return null;

    const data = await readFile(path, 'utf8');
    return data;
  },
  async removeItem(key: string) {
    const path = baseDir + encodeURIComponent(key);
    const isExists = await exists(path);
    if (isExists) await unlink(path);
  },
  async getAllKeys() {
    const files = await readDir(baseDir);
    const list = files.filter((file) => file.isFile());
    return list.map((f) => decodeURIComponent(f.name));
  },
};
