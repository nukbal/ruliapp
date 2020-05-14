import { Platform } from 'react-native';
import { CachesDirectoryPath } from 'react-native-fs';
import Cache from 'utils/Cache';

export const IS_ANDROID = Platform.OS === 'android';
export const IS_IOS = Platform.OS === 'ios';

export const USER_AGENT = (
  IS_IOS
    ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1'
    : 'Mozilla/5.0 (Linux; Android 10; Pixel 3a) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.62 Mobile Safari/537.36'
);

// 24 hours
export const AUTH_TIMEOUT = __DEV__ ? Infinity : 86400000;

// @ts-ignore
export const DEFAULT_IMAGE_SIZE = IS_IOS && Platform.isPad ? 350 : 250;

// unit: ms
export const REQUEST_THROTTLE = 850;

export const CACHE_PATH = `${CachesDirectoryPath}/appcache`;

export const FILE_PREFIX = IS_ANDROID ? 'file://' : '';

// short-live in-memory caches
export const PATH_CACHE = Cache<string>(50);
export const SHARE_CACHE = Cache<any>(15);
export const BOARD_CACHE = Cache<any>(3);
