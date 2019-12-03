import React, { useEffect } from 'react';
import { TouchableOpacity, Platform, StatusBar } from 'react-native';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { getTheme, getThemeMode } from 'app/stores/theme';

import BoardStack from './Board';
import BoardList from './BoardList';
import PostScreen from './Post';

import Settings from './Settings/Settings';
import Login from './Settings/Login';

const Root = createNativeStackNavigator();
const Main = createNativeStackNavigator();
const Config = createNativeStackNavigator();

let marginRight: number | undefined;
if (Platform.OS !== 'ios') {
  marginRight = 8;
}

function ConfigRouter() {
  const theme = useSelector(getTheme);

  return (
    <Config.Navigator
      initialRouteName="settings"
      screenOptions={{
        headerHideShadow: true,
        headerStyle: {
          backgroundColor: theme.gray[50],
        },
        headerTitle: '',
        headerBackTitle: '',
        contentStyle: {
          backgroundColor: theme.gray[50],
        },
      }}
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
        headerHideShadow: true,
        headerStyle: {
          backgroundColor: theme.gray[50],
        },
        headerTitle: '',
        headerBackTitle: '',
        contentStyle: {
          backgroundColor: theme.gray[50],
        },
      }}
    >
      <Main.Screen
        name="main"
        component={BoardList}
        options={({ navigation }) => ({
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('config')}
              style={{ marginRight }}
            >
              <Icons name="tune" size={24} color={theme.gray[800]} />
            </TouchableOpacity>
          ),
        })}
      />
      <Main.Screen name="board" component={BoardStack} />
      <Main.Screen
        name="post"
        component={PostScreen}
        options={{
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {}}
              style={{ marginRight }}
            >
              <Icons name="more-vert" size={24} color={theme.gray[800]} />
            </TouchableOpacity>
          ),
        }}
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
        presentation: 'modal',
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
