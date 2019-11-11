import React, { useState } from 'react';
import { Alert, View, Button, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';

import Title from 'app/components/Title';
import { getTheme } from 'app/stores/theme';
import { Actions } from 'app/stores/user';
import { USER_AGENT } from 'app/config/constants';

import getUserInfo from './getUserInfo';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  input: {
    padding: 16,
    fontSize: 18,
    marginBottom: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(100,100,100,0.125)',
  },
  button: {
    paddingVertical: 8,
  },
});

export default function Login({ navigation }: { navigation: any }) {
  const dispatch = useDispatch();
  const theme = useSelector(getTheme);
  const [userId, setUserId] = useState('');
  const [pass, setUserPw] = useState('');

  const submit = async () => {
    if (!userId || !pass) {
      Alert.alert('입력해주세요');
      return;
    }
    try {
      await fetch('https://user.ruliweb.com/member/login_proc', {
        method: 'POST',
        credentials: 'include',
        body: `user_id=${userId}&user_pw=${pass}&keep-login`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          referer: 'https://user.ruliweb.com/member/login',
          'User-Agent': USER_AGENT,
        },
      });
    } catch (e) {
      Alert.alert('로그인에 실패하였습니다.');
      return;
    }

    try {
      const userInfo = await getUserInfo();
      dispatch(Actions.login(userInfo));
      navigation.goBack();
    } catch (e) {
      Alert.alert('유저 정보 취득에 실패하였습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <Title label="로그인" />
      <TextInput
        value={userId}
        onChangeText={setUserId}
        placeholder="아이디"
        autoCompleteType="username"
        textContentType="username"
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor={theme.gray[600]}
        style={[styles.input, { color: theme.gray[800] }]}
      />
      <TextInput
        value={pass}
        onChangeText={setUserPw}
        placeholder="패스워드"
        autoCompleteType="password"
        textContentType="password"
        autoCapitalize="none"
        secureTextEntry
        placeholderTextColor={theme.gray[600]}
        style={[styles.input, { color: theme.gray[800] }]}
      />
      <Button
        title="로그인"
        onPress={submit}
        color={theme.primary[400]}
        disabled={!userId || !pass}
      />
    </View>
  );
}
