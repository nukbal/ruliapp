import React from 'react';
import { TouchableOpacity, Platform } from 'react-native';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { getTheme } from 'app/stores/theme';

import BoardStack from './Board';
import BoardList from './BoardList';
import PostScreen from './Post';

import Settings from './Settings/Settings';
import Login from './Settings/Login';

const Root = createNativeStackNavigator();
const Main = createNativeStackNavigator();
const Config = createNativeStackNavigator();

let marginTop: number | undefined;
let marginRight: number | undefined;
if (Platform.OS === 'ios') {
  marginTop = 60;
  if (Platform.isPad) {
    marginTop = 75;
  }
} else {
  marginRight = 8;
}

function BoardRoute() {
  const theme = useSelector(getTheme);
  return (
    <Main.Navigator
      initialRouteName="BoardList"
      screenOptions={({ navigation }) => ({
        headerHideShadow: true,
        headerStyle: {
          backgroundColor: theme.gray[50],
        },
        headerTitle: '',
        headerBackTitle: '',
        headerRight: () => (
          <TouchableOpacity
            onPress={() => navigation.navigate(Platform.OS === 'ios' ? 'Config' : 'Settings')}
            style={{ marginRight }}
          >
            <Icons name="tune" size={24} color={theme.primary[600]} />
          </TouchableOpacity>
        ),
        contentStyle: {
          marginTop,
          backgroundColor: theme.gray[50],
        },
      })}
    >
      <Main.Screen name="BoardList" component={BoardList} />
      <Main.Screen name="Board" component={BoardStack} />
      <Main.Screen name="Post" component={PostScreen} />
    </Main.Navigator>
  );
}

function ConfigRouter() {
  const theme = useSelector(getTheme);
  return (
    <Config.Navigator
      initialRouteName="Settings"
      screenOptions={({ navigation }) => ({
        headerHideShadow: true,
        headerTintColor: theme.gray[800],
        headerStyle: {
          backgroundColor: theme.gray[50],
        },
        headerTitle: '',
        headerRight: () => (
          <TouchableOpacity
            onPress={() => navigation.navigate('Main')}
          >
            <Icons name="close" size={24} color={theme.gray[800]} />
          </TouchableOpacity>
        ),
        contentStyle: {
          marginTop,
          backgroundColor: theme.gray[50],
        },
      })}
    >
      <Config.Screen name="Settings" component={Settings} />
      <Config.Screen name="Login" component={Login} options={{ headerBackTitle: '설정' }} />
    </Config.Navigator>
  );
}

export default function Router() {
  const theme = useSelector(getTheme);
  return (
    <Root.Navigator
      initialRouteName="Main"
      screenOptions={({ route }) => ({
        headerShown: false,
        presentation: 'transparentModal',
        contentStyle: {
          backgroundColor: theme.gray[50],
          paddingTop: Platform.OS === 'android' && route.name !== 'Main' ? 16 : undefined,
        },
      })}
    >
      <Root.Screen name="Main" component={BoardRoute} />
      {Platform.OS === 'ios' ? (
        <Root.Screen name="Config" component={ConfigRouter} />
      ) : (
        <>
          <Root.Screen name="Settings" component={Settings} />
          <Root.Screen name="Login" component={Login} />
        </>
      )}
    </Root.Navigator>
  );
}
