import React, { useEffect } from 'react';
import { Platform, StatusBar } from 'react-native';
// import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
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
  const theme = useSelector(getTheme);
  return (
    <Config.Navigator
      initialRouteName="settings"
      screenOptions={({ navigation }) => ({
        headerTitle: '',
        headerBackTitle: '',
        headerBackImage: BackButton,
        headerStyle: {
          backgroundColor: theme.gray[50],
        },
        headerHideShadow: true,
        contentStyle: {
          backgroundColor: theme.gray[50],
        },
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
  const theme = useSelector(getTheme);

  return (
    <Main.Navigator
      initialRouteName="main"
      screenOptions={{
        headerTitle: '',
        headerBackTitle: '',
        headerStyle: {
          backgroundColor: theme.gray[50],
        },
        headerTintColor: theme.gray[800],
        headerHideShadow: true,
        contentStyle: {
          backgroundColor: theme.gray[50],
        },
      }}
    >
      <Main.Screen
        name="main"
        component={BoardList}
        options={({ navigation }) => ({
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
        ['black', 'dark'].indexOf(mode) !== -1 ? 'light-content' : 'dark-content',
      );
    }
  }, [mode]);

  return (
    <Root.Navigator
      initialRouteName="root"
      screenOptions={{
        headerShown: false,
        stackPresentation: 'transparentModal',
        contentStyle: {
          backgroundColor: theme.gray[50],
        },
      }}
    >
      <Root.Screen name="root" component={MainRouter} />
      <Root.Screen name="config" component={ConfigRouter} />
    </Root.Navigator>
  );
}
