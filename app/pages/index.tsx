import React from 'react';
import { createStackNavigator } from 'react-navigation';
import BoardStack from './Board';
import BoardList from './BoardList';
import PostScreen from './Post';
import Header from './Header';

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
}, {
  initialRouteName: 'BoardList',
  defaultNavigationOptions: ({ navigation }) => ({
    title: navigation.getParam('title', ''),
    header: <Header navigation={navigation} />,
  }),
});
