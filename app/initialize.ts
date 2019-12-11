import { exists, mkdir } from 'react-native-fs';
import { baseDir } from './utils/persistStorage';
import { VIDEO_CACHE } from './config/constants';

exists(baseDir).then((isExists) => {
  if (!isExists) mkdir(baseDir);
});
exists(VIDEO_CACHE).then((isExists) => {
  if (!isExists) mkdir(VIDEO_CACHE);
});
