import React, { useContext } from 'react';
import { TouchableOpacity, Platform } from 'react-native';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BoardStack from './Board';
import BoardList from './BoardList';
import PostScreen from './Post';

import Settings from './Settings/Settings';
import Login from './Settings/Login';
import ThemeContext from '../ThemeContext';

const Root = createNativeStackNavigator();
const Main = createNativeStackNavigator();
const Config = createNativeStackNavigator();

let marginTop: number | undefined;
if (Platform.OS === 'ios') {
  marginTop = 60;
  if (Platform.isPad) {
    marginTop = 75;
  }
}

function BoardRoute() {
  const { theme } = useContext(ThemeContext);
  return (
    <Main.Navigator
      initialRouteName="BoardList"
      screenOptions={({ navigation }) => ({
        headerHideShadow: true,
        headerStyle: {
          backgroundColor: theme.gray[100],
        },
        headerTitle: '',
        headerBackTitle: '',
        headerRight: () => (
          <TouchableOpacity
            onPress={() => navigation.navigate('Config')}
          >
            <Icons name="tune" size={24} color={theme.primary[600]} />
          </TouchableOpacity>
        ),
        contentStyle: {
          marginTop,
          backgroundColor: theme.gray[100],
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
  const { theme } = useContext(ThemeContext);
  return (
    <Config.Navigator
      initialRouteName="Settings"
      screenOptions={({ navigation }) => ({
        headerHideShadow: true,
        headerTintColor: theme.gray[800],
        headerStyle: {
          backgroundColor: theme.gray[100],
        },
        headerRight: () => (
          <TouchableOpacity
            onPress={() => navigation.navigate('Main')}
          >
            <Icons name="close" size={24} color={theme.gray[800]} />
          </TouchableOpacity>
        ),
        contentStyle: {
          marginTop,
          backgroundColor: theme.gray[100],
        },
      })}
    >
      <Config.Screen name="Settings" component={Settings} options={{ headerTitle: '설정' }} />
      <Config.Screen name="Login" component={Login} options={{ headerTitle: '로그인' }} />
    </Config.Navigator>
  );
}

export default function Router() {
  const { theme } = useContext(ThemeContext);
  return (
    <Root.Navigator
      initialRouteName="Main"
      screenOptions={{
        headerShown: false,
        presentation: 'transparentModal',
        contentStyle: {
          backgroundColor: theme.gray[100],
        },
      }}
    >
      <Root.Screen name="Main" component={BoardRoute} />
      <Root.Screen name="Config" component={ConfigRouter} />
    </Root.Navigator>
  );
}
