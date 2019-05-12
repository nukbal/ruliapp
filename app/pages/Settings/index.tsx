import React, { useState, useEffect, useCallback } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView, NavigationScreenProp, NavigationEventCallback } from 'react-navigation';
import styles from './styles';
import ImageCache from './ImageCache';
import PostCache from './postCache';

interface Props {
  navigation: NavigationScreenProp<any, { title: string, key: string }>;
}

export default function Setting({ navigation }: Props) {
  const [show, setShow] = useState(true);

  const handleEvent: NavigationEventCallback = useCallback((e) => {
    setShow(e.type === 'didFocus');
  }, []);

  useEffect(() => {
    const onFocus = navigation.addListener('didFocus', handleEvent);
    const onBlur = navigation.addListener('willBlur', handleEvent);
    return () => {
      onFocus.remove();
      onBlur.remove();
    };
  }, [handleEvent, navigation]);

  if (!show) return null;
  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.headerText}>게시판</Text>
      </View>
      <ImageCache />
      <PostCache />
    </SafeAreaView>
  );
}
