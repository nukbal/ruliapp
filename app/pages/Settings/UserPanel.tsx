import React from 'react';
import { View, Alert, Text, StyleSheet, Image } from 'react-native';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';

import { getTheme } from 'stores/theme';
import { getUserInfo, getLoginStatus, logout } from 'stores/user';
import ListItem, { listStyles } from 'components/ListItem';

const styles = StyleSheet.create({
  panel: {
    marginTop: 12,
    marginBottom: 12,
  },
  userText: {
    fontSize: 18,
    fontWeight: '600',
  },
  userStatusText: {
    fontSize: 12,
  },
  avatar: {
    height: 45,
    width: 45,
    borderRadius: 25,
    marginRight: 12,
  },
});

export default function UserPanel({ navigation }: { navigation: any }) {
  const dispatch = useDispatch();
  const theme = useSelector(getTheme);
  const isLogined = useSelector(getLoginStatus);
  const userInfo = useSelector(getUserInfo);

  const login = () => navigation.navigate('login');
  const onLogout = () => Alert.alert('로그아웃', '로그아웃 하시겠습니까?', [
    { text: '취소', style: 'cancel' },
    {
      text: '로그아웃',
      onPress: async () => {
        try {
          await fetch('https://bbs.ruliweb.com/member/logout');
          dispatch(logout());
        } catch (e) {
          // ignore
        }
      },
    },
  ]);

  if (!isLogined) {
    return (
      <ListItem
        name="account-circle"
        onPress={login}
        right={<Icons name="arrow-forward" size={20} color={theme.gray[800]} />}
      >
        로그인
      </ListItem>
    );
  }

  return (
    <>
      <View style={[listStyles.item, listStyles.itemHeader, styles.panel]}>
        {userInfo.avatar && <Image source={{ uri: userInfo.avatar }} style={styles.avatar} />}
        <View>
          <Text style={[styles.userText, { color: theme.gray[800] }]}>
            {userInfo.name}
          </Text>
          <Text style={[listStyles.itemHeader, styles.userStatusText, { color: theme.gray[800] }]}>
            {`${userInfo.level}Lv. (${userInfo.expNow}% / ${userInfo.expLeft}) ${userInfo.attends}일`}
          </Text>
        </View>
      </View>
      <ListItem
        name="exit-to-app"
        onPress={onLogout}
        right={<Icons name="arrow-forward" size={18} color={theme.gray[800]} />}
      >
        로그아웃
      </ListItem>
    </>
  );
}
