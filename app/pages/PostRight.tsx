import React, { useState, useEffect } from 'react';
import { ToastAndroid } from 'react-native';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';

import BottomSheet from 'components/BottomSheet';
import ListItem from 'components/ListItem';
import { IS_ANDROID } from 'config/constants';
import { getPost } from 'stores/post';

import HeaderRight from './HeaderRight';

export default function PostRight({ route, navigation }: any) {
  const { url, bookmark } = route.params;
  const key = `ward:${url}`;
  const [show, setShow] = useState(false);
  const [warded, isWarded] = useState(false);
  const data = useSelector(getPost(url));
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
    if (bookmark) navigation.goBack();
  };

  useEffect(() => {
    AsyncStorage
      .getItem(key)
      .then((d) => isWarded(!!d));
  }, [key]);

  return (
    <>
      <HeaderRight name="more-vert" onPress={onPress} />
      <BottomSheet show={show} onClose={onClose}>
        <ListItem name="bookmark" onPress={toggleBookmark}>
          {warded ? '와드 제거하기' : '와드 추가하기'}
        </ListItem>
      </BottomSheet>
    </>
  );
}
