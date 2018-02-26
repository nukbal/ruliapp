import React from 'react';
import { TabNavigator, TabBarBottom } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BoardScreen from './Board';
import SettingsScreen from './Settings';
import { darkBarkground, labelText, primary, border } from '../styles/color';

export default TabNavigator(
  {
    Board: { screen: BoardScreen },
    Settings: { screen: SettingsScreen },
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        switch(routeName) {
          case 'Board':
            iconName = `ios-list-box${focused ? '' : '-outline'}`;
            break;
          // case 'Popular':
          //   iconName = `ios-happy${focused ? '' : '-outline'}`;
          //   break;
          case 'Settings':
            iconName = `ios-options${focused ? '' : '-outline'}`;
          default:
            break;
        }
        return <Ionicons name={iconName} size={25} color={tintColor} />;
      },
    }),
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    tabBarOptions: {
      activeTintColor: primary,
      inactiveTintColor: labelText,
      style: {
        backgroundColor: darkBarkground,
        borderTopColor: border,
        borderTopWidth: 1,
      },
      showLabel: false,
    },
    animationEnabled: false,
    swipeEnabled: false,
  }
);
