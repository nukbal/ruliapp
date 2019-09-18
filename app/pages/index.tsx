import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';

import BoardStack from './Board';
import BoardList from './BoardList';
import PostScreen from './Post';
import Header from './Header';

import Settings from './Settings';

export default createStackNavigator({
  BoardList: {
    screen: BoardList,
  },
  Board: {
    screen: BoardStack,
  },
  Post: {
    screen: PostScreen,
  },
  Settings: {
    screen: Settings,
  },
}, {
  initialRouteName: 'BoardList',
  defaultNavigationOptions: ({ navigation }: any) => ({
    title: navigation.getParam('title', ''),
    header: <Header navigation={navigation} />,
  }),
});
