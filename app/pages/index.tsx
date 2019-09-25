import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';

import BoardStack from './Board';
import BoardList from './BoardList';
import PostScreen from './Post';
import Header from './Header';

import Settings from './Settings/Settings';
import Login from './Settings/Login';

export default createStackNavigator({
  BoardList: {
    screen: BoardList,
    params: { title: '루리웹' },
  },
  Board: {
    screen: BoardStack,
  },
  Post: {
    screen: PostScreen,
  },
  Settings: {
    screen: Settings,
    params: { title: '설정' },
  },
  Login: {
    screen: Login,
    params: { title: '로그인' },
  },
}, {
  initialRouteName: 'BoardList',
  defaultNavigationOptions: ({ navigation }: any) => ({
    header: <Header navigation={navigation} />,
  }),
});
