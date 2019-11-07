import { Platform } from 'react-native';

export const USER_AGENT = (
  Platform.OS === 'ios'
    ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E217'
    : 'Mozilla/5.0 (Linux; Android 5.1.1; Android SDK built for x86 Build/LMY48X) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/39.0.0.0 Mobile Safari/537.36'
);

// 24 hours
export const AUTH_TIMEOUT = __DEV__ ? Infinity : 86400000;

export const DEFAULT_IMAGE_SIZE = Platform.OS === 'ios' && Platform.isPad ? 350 : 200;
