import React, { useState, useCallback, useEffect } from 'react';
import { Alert, ToastAndroid, Platform } from 'react-native';
import { readDir, unlink, exists } from 'react-native-fs';

import { CACHE_PATH, PATH_CACHE } from 'config/constants';
import ListItem from 'components/ListItem';
import Text from 'components/Text';

export default function CachePanel() {
  const [size, setSize] = useState(0);

  const onPress = useCallback(() => {
    async function clearCache() {
      const isExists = await exists(CACHE_PATH);
      if (!isExists) return;
      const cache = await readDir(CACHE_PATH);
      await Promise.all(cache.map((file) => unlink(file.path)));
      PATH_CACHE.clear();
      setSize(0);
      if (Platform.OS === 'android') {
        ToastAndroid.show('캐시가 삭제되었습니다.', ToastAndroid.SHORT);
      }
    }
    Alert.alert(
      '캐시',
      '지금까지 저장한 캐시가 모두 삭제됩니다. 진행하시겠습니까?',
      [
        { text: '닫기' },
        { text: 'OK', onPress: clearCache },
      ],
    );
  }, []);

  useEffect(() => {
    async function init() {
      const isExists = await exists(CACHE_PATH);
      if (!isExists) return;
      const cache = await readDir(CACHE_PATH);
      const total = cache.reduce((acc, file) => acc + parseInt(file.size, 10), 0);
      setSize(Math.round((total / 1048576) * 100) / 100);
    }
    init();
  }, []);

  return (
    <ListItem
      name="image"
      onPress={onPress}
      right={<Text>{`${size}MB`}</Text>}
    >
      캐시된 이미지
    </ListItem>
  );
}
