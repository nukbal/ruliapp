import { Platform, ToastAndroid, PermissionsAndroid } from 'react-native';
import { PicturesDirectoryPath, exists, mkdir, scanFile, copyFile } from 'react-native-fs';
import { CACHE_PATH } from '../config/constants';

let dirExists = false;
const androidPath = `${PicturesDirectoryPath}/Ruliapp/`;

export default async function saveFile(path: string) {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      if (!granted) throw new Error('Storage Permission Not Granted');

      if (!dirExists) {
        const isExist = await exists(androidPath);
        if (!isExist) await mkdir(androidPath);
        dirExists = true;
      }
      const destPath = androidPath + path.replace(CACHE_PATH, '');
      await copyFile(path, destPath);
      await scanFile(destPath);
      ToastAndroid.show('저장했습니다.', ToastAndroid.SHORT);
    } else {
      // save to album for IOS
    }
  } catch (e) {
    console.warn(e);
    if (Platform.OS === 'android') ToastAndroid.show('저장에 실패하였습니다.', ToastAndroid.SHORT);
  }
}
