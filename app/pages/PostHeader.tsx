import React, { useState, useEffect } from 'react';
import { ToastAndroid, View, StyleSheet, useWindowDimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import { useTheme } from '@react-navigation/native';
import { useNavigation, DrawerActions } from '@react-navigation/core';

import BottomSheet from 'components/BottomSheet';
import ListItem from 'components/ListItem';
import Button from 'components/Button';
import { IS_ANDROID } from 'config/constants';
import { getPost, getCurrentPostKey, setCurrent } from 'stores/post';

export default function PostHeader() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { path, ward } = useSelector(getCurrentPostKey);
  const data = useSelector(getPost);
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const [show, setShow] = useState(false);
  const [warded, isWarded] = useState(false);

  const isExists = !!path;
  const key = `ward:${path}`;
  const isLargeScreen = width >= 735;

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
    if (warded) navigation.goBack();
  };

  const dismiss = () => {
    navigation.dispatch(DrawerActions.closeDrawer());
    if (isLargeScreen) {
      dispatch(setCurrent({ url: '' }));
    } else {
      setTimeout(() => dispatch(setCurrent({ url: '' })), 250);
    }
  };

  useEffect(() => {
    if (!ward) {
      isWarded(true);
      return;
    }
    AsyncStorage
      .getItem(key)
      .then((d) => isWarded(!!d));
  }, [key, ward]);

  return (
    <View style={[styles.container, { borderColor: colors.border }]}>
      {isExists && (
        <View>
          <Button
            name={isLargeScreen ? 'x' : 'chevron-left'}
            onPress={dismiss}
          />
        </View>
      )}
      {isExists && (
        <View>
          <Button name="menu" onPress={onPress} />
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
    paddingHorizontal: 6,
    paddingTop: 24,
    height: 68.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
  },
});
