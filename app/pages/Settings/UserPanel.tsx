import React from 'react';
import { View, Alert, Text, StyleSheet, TouchableHighlight, Image } from 'react-native';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';

import { getTheme } from 'app/stores/theme';
import { getUserInfo, getLoginStatus, logout } from 'app/stores/user';

import { styles as SettingStyle } from './Settings';

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
      <TouchableHighlight
        style={SettingStyle.item}
        underlayColor={theme.gray[400]}
        onPress={login}
      >
        <>
          <View style={SettingStyle.itemHeader}>
            <Icons name="account-circle" size={20} color={theme.gray[800]} style={SettingStyle.iconStyle} />
            <Text style={[SettingStyle.itemText, { color: theme.gray[800] }]}>
              로그인
            </Text>
          </View>
          <Icons name="arrow-forward" size={20} color={theme.gray[800]} />
        </>
      </TouchableHighlight>
    );
  }

  return (
    <>
      <View style={[SettingStyle.item, SettingStyle.itemHeader, styles.panel]}>
        {userInfo.avatar && <Image source={{ uri: userInfo.avatar }} style={styles.avatar} />}
        <View>
          <Text style={[styles.userText, { color: theme.gray[800] }]}>
            {userInfo.name}
          </Text>
          <Text style={[SettingStyle.itemHeader, styles.userStatusText, { color: theme.gray[800] }]}>
            {`${userInfo.level}Lv. (${userInfo.expNow}% / ${userInfo.expLeft}) ${userInfo.attends}일`}
          </Text>
        </View>
      </View>
      <TouchableHighlight
        style={SettingStyle.item}
        underlayColor={theme.gray[400]}
        onPress={onLogout}
      >
        <>
          <View style={SettingStyle.itemHeader}>
            <Icons name="exit-to-app" size={18} color={theme.gray[800]} style={SettingStyle.iconStyle} />
            <Text style={[SettingStyle.itemText, { color: theme.gray[800] }]}>
              로그아웃
            </Text>
          </View>
          <Icons name="arrow-forward" size={18} color={theme.gray[800]} />
        </>
      </TouchableHighlight>
    </>
  );
}
