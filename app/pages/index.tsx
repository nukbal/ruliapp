import React, { useContext } from 'react';
import { TouchableOpacity, Platform } from 'react-native';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { NavigationNativeContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BoardStack from './Board';
import BoardList from './BoardList';
import PostScreen from './Post';

import Settings from './Settings/Settings';
import Login from './Settings/Login';
import ThemeContext from '../ThemeContext';

const Root = createNativeStackNavigator();
const Main = createNativeStackNavigator();

function BoardRoute() {
  const { theme } = useContext(ThemeContext);
  let marginTop: number | undefined;
  if (Platform.OS === 'ios') {
    marginTop = 60;
    if (Platform.isPad) {
      marginTop = 75;
    }
  }
  return (
    <Main.Navigator
      initialRouteName="BoardList"
      screenOptions={({ navigation }) => ({
        headerHideShadow: true,
        headerStyle: {
          backgroundColor: theme.background,
          paddingRight: 8,
        },
        headerTintColor: theme.primary,
        headerTitle: '',
        headerBackTitle: '',
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Icons name="tune" size={24} color={theme.primary} />
          </TouchableOpacity>
        ),
        contentStyle: {
          marginTop,
          backgroundColor: 'transparent',
        },
      })}
    >
      <Main.Screen name="BoardList" component={BoardList} />
      <Main.Screen name="Board" component={BoardStack} />
      <Main.Screen name="Post" component={PostScreen} />
    </Main.Navigator>
  );
}

export default function Router() {
  const { theme } = useContext(ThemeContext);
  return (
    <NavigationNativeContainer>
      <Root.Navigator
        initialRouteName="Main"
        screenOptions={({ route }) => ({
          headerShown: false,
          presentation: 'modal',
          contentStyle: {
            backgroundColor: theme.background,
            paddingTop: (Platform.OS !== 'ios' && route.name !== 'Main') ? 32 : 0,
          },
        })}
      >
        <Root.Screen name="Main" component={BoardRoute} />
        <Root.Screen name="Settings" component={Settings} />
        <Root.Screen name="Login" component={Login} />
      </Root.Navigator>
    </NavigationNativeContainer>
  );
}
