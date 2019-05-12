import React, { useState, useEffect, useCallback } from 'react';
import { TouchableOpacity, Text, Alert, AsyncStorage } from 'react-native';
import fs from 'react-native-fs';
import { IMG_PATH } from '../../config/constants';
import cancel from '../../utils/cancel';
import styles from './styles';

export default function ImageCache() {
  const [bytes, setBytes] = useState(0);
  const [refresh, setRefresh] = useState(true);

  useEffect(() => {
    const p = cancel(fs.readDir(IMG_PATH));
    if (refresh) {
      p.promise.then((items: fs.ReadDirItem[]) => {
        setBytes(items.reduce((acc, cur) => (acc + parseInt(cur.size, 10)), 0));
        setRefresh(false);
      }).catch(() => {});
    }
    return () => {
      if (p) p.cancel();
    };
  }, [refresh]);

  const onPress = useCallback(() => {
    async function deleteAll() {
      try {
        const [keys, paths] = await Promise.all([AsyncStorage.getAllKeys(), fs.readDir(IMG_PATH)]);
        const pendings = [];
        pendings.push(
          AsyncStorage.multiRemove(
            keys.filter(item => item.indexOf('@Image') > -1),
          ),
        );

        for (let i = 0; i < paths.length; i += 1) {
          pendings.push(fs.unlink(paths[i].path));
        }

        await Promise.all(pendings);
        Alert.alert('Done!');
        setRefresh(true);
      } catch (e) {
        // ignore
      }
    }

    Alert.alert(
      '이미지 삭제',
      '저장된 모든 이미지 캐시가 삭제됩니다. 진행하시겠습니까?',
      [
        { text: '나중에', onPress: () => null },
        { text: 'OK', onPress: deleteAll },
      ],
    );
  }, []);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
    >
      <Text>{`캐시된 이미지: ${Math.round(bytes / 1024)}KB`}</Text>
    </TouchableOpacity>
  );
}
