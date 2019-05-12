import React, { useState, useEffect, useCallback } from 'react';
import { TouchableOpacity, Text, Alert, AsyncStorage } from 'react-native';
import styles from './styles';

export default function ImageCache() {
  const [posts, setPosts] = useState(0);
  const [refresh, setRefresh] = useState(true);

  useEffect(() => {
    if (!refresh) return;
    AsyncStorage.getAllKeys((err, keys) => {
      if (keys) {
        const cachedKey = keys.filter(key => key.indexOf('@Post') > -1);
        setPosts(cachedKey.length);
      }
      setRefresh(false);
    });
  }, [refresh]);

  const onPress = useCallback(() => {
    function deleteAll() {
      if (posts === 0) {
        Alert.alert('Done!');
        return;
      }
      AsyncStorage.getAllKeys((err, keys) => {
        if (keys) {
          AsyncStorage
            .multiRemove(keys.filter(key => key.indexOf('@Post') > -1))
            .then(() => {
              Alert.alert('Done!');
              setRefresh(true);
            });
        }
      });
    }

    Alert.alert(
      '게시글 캐시 삭제',
      '저장된 모든 게시글 캐시가 삭제됩니다. 진행하시겠습니까?',
      [
        { text: '나중에', onPress: () => null },
        { text: 'OK', onPress: deleteAll },
      ],
    );
  }, [posts]);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
    >
      <Text>{`캐시된 게시글: ${posts}건`}</Text>
    </TouchableOpacity>
  );
}
