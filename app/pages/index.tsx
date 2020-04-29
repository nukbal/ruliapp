import React, { useEffect } from 'react';
import { Platform, StatusBar, useWindowDimensions } from 'react-native';
import { NavigationContainer, DefaultTheme, useTheme } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
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

const Root = createNativeStackNavigator();
const Main = createDrawerNavigator();
const Board = createStackNavigator();
const Config = createStackNavigator();

function ConfigRouter() {
  return (
    <Config.Navigator
      initialRouteName="settings"
      screenOptions={({ navigation }) => ({
        headerTitle: '',
        headerBackTitleVisible: false,
        headerHideShadow: true,
        headerLeft: ({ canGoBack, onPress }) => (
          canGoBack ? <Button name="chevron-left" onPress={onPress} /> : null
        ),
        headerRight: () => (
          <Button
            name="x"
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

function BoardRouter() {
  const { colors } = useTheme();
  return (
    <Board.Navigator
      initialRouteName="list"
      screenOptions={{
        headerTitle: '',
        headerTintColor: colors.text,
        headerRightContainerStyle: { paddingRight: 6 },
        headerLeftContainerStyle: { paddingLeft: 6 },
        headerLeft: ({ canGoBack, onPress }) => (
          canGoBack ? <Button name="chevron-left" onPress={onPress} /> : null
        ),
      }}
    >
      <Board.Screen
        name="list"
        component={BoardList}
        options={({ navigation }) => ({
          headerRight: () => <Button name="settings" onPress={() => navigation.push('config')} />,
        })}
      />
      <Board.Screen name="board" component={BoardStack} />
      <Board.Screen name="ward" component={WardList} />
    </Board.Navigator>
  );
}

function MainRouter() {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 735;
  const drawerStyle = { width: isLargeScreen ? '72.5%' : '100%' };

  return (
    <Main.Navigator
      initialRouteName="main"
      openByDefault={isLargeScreen}
      drawerType={isLargeScreen ? 'permanent' : 'front'}
      drawerStyle={drawerStyle}
      overlayColor="transparent"
      drawerPosition="right"
      drawerContent={({ navigation }) => (
        <>
          <PostHeader navigation={navigation} />
          <PostScreen />
        </>
      )}
    >
      <Main.Screen name="main" component={BoardRouter} />
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
      border: theme.gray[100],
      text: theme.gray[800],
      disabled: theme.gray[300],
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <Root.Navigator
        initialRouteName="root"
        screenOptions={{
          headerShown: false,
          stackPresentation: 'modal',
        }}
      >
        <Root.Screen name="root" component={MainRouter} />
        <Root.Screen name="config" component={ConfigRouter} />
      </Root.Navigator>
    </NavigationContainer>
  );
}
