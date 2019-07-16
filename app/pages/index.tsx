import React from 'react';
import { createStackNavigator } from 'react-navigation';
import Icons from 'react-native-vector-icons/MaterialIcons';
import BoardStack from './Board';
import BoardList from './BoardList';
import PostScreen from './Post';

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
  defaultNavigationOptions: ({ navigation, screenProps }) => ({
    title: navigation.getParam('title', ''),
    headerStyle: {
      backgroundColor: screenProps.theme.background,
    },
    headerTintColor: screenProps.theme.background,
    headerTitleStyle: {
      color: screenProps.theme.primary,
      fontWeight: 'bold',
    },
    headerBackImage: <Icons name="chevron-left" color={screenProps.theme.primary} size={24} />,
  }),
});
