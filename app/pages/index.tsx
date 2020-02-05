import React, { useEffect } from 'react';
import { Platform, StatusBar } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import { getTheme, getThemeMode } from 'stores/theme';

import HeaderRight from './HeaderRight';
import PostRight from './PostRight';

import BoardStack from './Board';
import BoardList from './BoardList';
import PostScreen from './Post';
import WardList from './Ward';

import Settings from './Settings/Settings';
import Login from './Settings/Login';

const Root = createNativeStackNavigator();
const Main = createNativeStackNavigator();
const Config = createNativeStackNavigator();

function BackButton({ tintColor }: { tintColor: string }) {
  return (
    <Icons
      name="navigate-before"
      size={32}
      color={tintColor}
    />
  );
}

function ConfigRouter() {
  return (
    <Config.Navigator
      initialRouteName="settings"
      screenOptions={({ navigation }) => ({
        headerTitle: '',
        headerBackTitle: '',
        headerBackImage: BackButton,
        headerHideShadow: true,
        headerRight: () => (
          <HeaderRight
            name="close"
            onPress={() => navigation.goBack()}
          />
        ),
      })}
    >
      <Config.Screen name="settings" component={Settings} />
      <Config.Screen name="login" component={Login} options={{ headerBackTitle: '설정' }} />
    </Config.Navigator>
  );
}

function MainRouter() {
  return (
    <Main.Navigator
      initialRouteName="main"
      screenOptions={{
        headerTitle: '',
        headerBackTitle: '',
        headerHideShadow: true,
      }}
    >
      <Main.Screen
        name="main"
        component={BoardList}
        options={({ navigation }) => ({
          headerHideBackButton: true,
          headerRight: () => <HeaderRight name="tune" onPress={() => navigation.push('config')} />,
        })}
      />
      <Main.Screen name="board" component={BoardStack} />
      <Main.Screen name="ward" component={WardList} />
      <Main.Screen
        name="post"
        component={PostScreen}
        options={({ route, navigation }) => ({
          headerRight: () => <PostRight route={route} navigation={navigation} />,
        })}
      />
    </Main.Navigator>
  );
}

export default function Router() {
  const mode = useSelector(getThemeMode);
  const theme = useSelector(getTheme);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      StatusBar.setBarStyle(
        mode ? 'light-content' : 'dark-content',
      );
    }
  }, [mode]);

  const navTheme: typeof DefaultTheme = {
    dark: mode,
    colors: {
      primary: theme.primary[600],
      background: theme.gray[50],
      card: theme.gray[50],
      border: theme.gray[600],
      text: theme.gray[800],
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <Root.Navigator
        initialRouteName="root"
        screenOptions={{
          headerShown: false,
          stackPresentation: 'transparentModal',
        }}
      >
        <Root.Screen name="root" component={MainRouter} />
        <Root.Screen name="config" component={ConfigRouter} />
      </Root.Navigator>
    </NavigationContainer>
  );
}
