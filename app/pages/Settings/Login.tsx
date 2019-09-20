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
    if (view.current && e.url.indexOf('http://user.ruliweb.com/login_result?sid=') === 0) {
      view.current.stopLoading();
      getUserInfo()
        .then((data) => dispatch(Actions.login(data)))
        .catch((err) => Alert.alert(err.message))
        .finally(() => navigation.goBack());
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
