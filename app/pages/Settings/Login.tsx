import React, { useRef, useContext } from 'react';
import { Alert } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import WebView, { WebViewNavigation } from 'react-native-webview';
import AuthContext, { Actions } from '../../AuthContext';

import getUserInfo from './getUserInfo';

export default function Login({ navigation }: { navigation: NavigationScreenProp<any> }) {
  const { dispatch } = useContext(AuthContext);
  const view = useRef<WebView | null>(null);
  const onNavChange = (e: WebViewNavigation) => {
    if (view.current && e.url.indexOf('login_result?sid=') > -1) {
      getUserInfo()
        .then((data) => {
          dispatch(Actions.login(data));
          navigation.goBack();
        })
        .catch((err) => {
          Alert.alert(err.message);
          navigation.goBack();
        });
    }
  };

  return (
    <WebView
      ref={view}
      onNavigationStateChange={onNavChange}
      source={{ uri: 'https://user.ruliweb.com/member/login?mode=m' }}
    />
  );
}
