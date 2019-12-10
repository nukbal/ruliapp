import React, { useState, useCallback, useEffect } from 'react';
import { Alert, ToastAndroid, Platform } from 'react-native';
import { readDir, unlink } from 'react-native-fs';
import { CACHE_PATH } from 'app/config/constants';
import ListItem from 'app/components/ListItem';
import Text from 'app/components/Text';

export default function CachePanel() {
  const [size, setSize] = useState(0);

  const onPress = useCallback(() => {
    function clearCache() {
      readDir(CACHE_PATH).then((files) => {
        files.forEach((file) => {
          unlink(CACHE_PATH + file.name);
        });
        setSize(0);
        if (Platform.OS === 'android') {
          ToastAndroid.show('캐시가 삭제되었습니다.', ToastAndroid.SHORT);
        }
      });
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
    readDir(CACHE_PATH).then((files) => {
      const total = files.reduce((acc, file) => acc + parseInt(file.size, 10), 0);
      setSize(Math.round(total / 1024));
    });
  }, []);

  return (
    <ListItem
      name="sd-card"
      onPress={onPress}
      right={<Text>{`${size}KB`}</Text>}
    >
      캐시된 이미지
    </ListItem>
  );
}
