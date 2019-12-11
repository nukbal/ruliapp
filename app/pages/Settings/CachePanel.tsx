import React, { useState, useCallback, useEffect } from 'react';
import { Alert, ToastAndroid, Platform } from 'react-native';
import { readDir, unlink } from 'react-native-fs';
import { VIDEO_CACHE, IMAGE_CACHE } from 'app/config/constants';
import ListItem from 'app/components/ListItem';
import Text from 'app/components/Text';

export default function CachePanel() {
  const [size, setSize] = useState(0);

  const onPress = useCallback(() => {
    async function clearCache() {
      const [images, videos] = await Promise.all([readDir(IMAGE_CACHE), readDir(VIDEO_CACHE)]);
      await Promise.all([
        ...videos.map((file) => unlink(file.path)),
        ...images.map((file) => unlink(file.path)),
      ]);
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
      const [images, videos] = await Promise.all([readDir(IMAGE_CACHE), readDir(VIDEO_CACHE)]);
      const videoSize = videos.reduce((acc, file) => acc + parseInt(file.size, 10), 0);
      const imageSize = images.reduce((acc, file) => acc + parseInt(file.size, 10), 0);
      const total = videoSize + imageSize;
      setSize(Math.round((total / 1048576) * 100) / 100);
    }
    init();
  }, []);

  return (
    <ListItem
      name="sd-card"
      onPress={onPress}
      right={<Text>{`${size}MB`}</Text>}
    >
      캐시된 이미지
    </ListItem>
  );
}
