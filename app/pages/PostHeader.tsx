import React, { useState, useEffect } from 'react';
import { ToastAndroid, View, StyleSheet, useWindowDimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';

import BottomSheet from 'components/BottomSheet';
import ListItem from 'components/ListItem';
import { IS_ANDROID } from 'config/constants';
import { getPost, getCurrentPostKey, setCurrent } from 'stores/post';

import HeaderRight from './HeaderRight';

export default function PostHeader({ navigation }: any) {
  const url = useSelector(getCurrentPostKey);
  const data = useSelector(getPost);
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 735;
  const dispatch = useDispatch();
  const isExists = !!url;
  const key = `ward:${url}`;
  const [show, setShow] = useState(false);
  const [warded, isWarded] = useState(false);
  const onClose = () => setShow(false);
  const onPress = () => setShow(true);
  const toggleBookmark = () => {
    if (data && !warded) {
      AsyncStorage
        .setItem(key, JSON.stringify(data))
        .then(() => {
          if (IS_ANDROID) ToastAndroid.show('와드추가', ToastAndroid.SHORT);
        });
    } else if (warded) {
      AsyncStorage
        .removeItem(key)
        .then(() => {
          if (IS_ANDROID) ToastAndroid.show('와드삭제', ToastAndroid.SHORT);
        });
    }
    setShow(false);
    // if (bookmark) navigation.goBack();
  };

  const dismiss = () => {
    navigation.closeDrawer();
    dispatch(setCurrent({ url: '' }));
  };

  useEffect(() => {
    AsyncStorage
      .getItem(key)
      .then((d) => isWarded(!!d));
  }, [key]);

  return (
    <View style={styles.container}>
      {isExists && (
        <View>
          <HeaderRight
            name={isLargeScreen ? 'close' : 'chevron-left'}
            onPress={dismiss}
          />
        </View>
      )}
      {isExists && (
        <View>
          <HeaderRight name="more-vert" onPress={onPress} />
          <BottomSheet show={show} onClose={onClose}>
            <ListItem name="bookmark" onPress={toggleBookmark}>
              {warded ? '와드 제거하기' : '와드 추가하기'}
            </ListItem>
          </BottomSheet>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    paddingTop: 24,
    height: 75,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
