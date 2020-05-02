import React, { useEffect } from 'react';
import {
  Platform, StatusBar, useWindowDimensions,
} from 'react-native';
import { NavigationContext } from '@react-navigation/core';
import { NavigationContainer, DefaultTheme, useTheme } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { getTheme, getThemeMode } from 'stores/theme';
import Button from 'components/Button';

import PostHeader from './PostHeader';

import BoardStack from './Board';
import BoardList from './BoardList';
import PostScreen from './Post';
import WardList from './Ward';

import Settings from './Settings/Settings';
import Login from './Settings/Login';

const Main = createDrawerNavigator();
const Board = createStackNavigator();

function BoardRouter() {
  const { colors } = useTheme();
  return (
    <Board.Navigator
      initialRouteName="list"
      screenOptions={({ navigation }) => ({
        headerTitle: '',
        headerTintColor: colors.text,
        headerLeft: ({ canGoBack }) => (
          canGoBack
            ? <Button name="chevron-left" onPress={() => navigation.goBack()} />
            : null
        ),
        headerStyle: { backgroundColor: colors.background },
        cardStyle: { paddingTop: 12 },
      })}
    >
      <Board.Screen
        name="list"
        component={BoardList}
        options={({ navigation }) => ({
          headerRight: () => (
            <Button name="settings" onPress={() => navigation.push('settings')} />
          ),
        })}
      />
      <Board.Screen name="board" component={BoardStack} />
      <Board.Screen name="ward" component={WardList} />
      <Board.Screen name="settings" component={Settings} />
      <Board.Screen name="login" component={Login} options={{ headerBackTitle: '설정' }} />
    </Board.Navigator>
  );
}

export default function Router() {
  const mode = useSelector(getThemeMode);
  const theme = useSelector(getTheme);
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 735;
  const drawerStyle = { width: isLargeScreen ? '72.5%' : '100%' };

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
      border: theme.gray[100],
      text: theme.gray[800],
      disabled: theme.gray[300],
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <Main.Navigator
        initialRouteName="main"
        openByDefault={isLargeScreen}
        drawerType={isLargeScreen ? 'permanent' : 'slide'}
        drawerStyle={drawerStyle}
        overlayColor="transparent"
        drawerPosition="right"
        drawerContent={({ navigation }) => (
          // @ts-ignore
          <NavigationContext.Provider value={navigation}>
            <PostHeader />
            <PostScreen />
          </NavigationContext.Provider>
        )}
      >
        <Main.Screen name="main" component={BoardRouter} />
      </Main.Navigator>
    </NavigationContainer>
  );
}
