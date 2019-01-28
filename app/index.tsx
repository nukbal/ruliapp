import React from 'react';
import { Provider } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { createBottomTabNavigator } from 'react-navigation-tabs';
// @ts-ignore
import { createAppContainer } from 'react-navigation';

import BoardStack from './containers/Board';
import DrawerScreen from './containers/Drawer';
import ConfigScreen from './containers/Settings';

import { primary } from './styles/color';
import createStores from './store';
import { AsyncStorage } from 'react-native';

const MainNav = createBottomTabNavigator(
  {
    Board: { screen: BoardStack },
    List: { screen: DrawerScreen },
    Settings: { screen: ConfigScreen, title: 'Settings' },
  },
  {
    // @ts-ignore
    defaultNavigationOptions: ({ navigation }) => ({
      // @ts-ignore
      tabBarIcon: ({ horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        const size = horizontal ? 20 : 25;
        switch (routeName) {
          case 'Board': {
            return <Icon name="dashboard" size={size} color={tintColor!} />;
          }
          case 'List': {
            return <Icon name="list" size={size} color={tintColor!} />;
          }
          case 'Settings': {
            return <Icon name="settings" size={size} color={tintColor!} />;
          }
          default: {
            return null;
          }
        }
      },
    }),
    tabBarOptions: {
      activeTintColor: primary,
      inactiveTintColor: 'gray',
    },
  }
);

const Container = createAppContainer(MainNav);

const store = createStores();

AsyncStorage.getAllKeys((err, keys) => {
  if (keys) {
    const cachedKey = keys.filter(key => key.indexOf('@Post') > -1);
    if (cachedKey.length) AsyncStorage.multiRemove(cachedKey);
  }
});

export default function App() {
  return (
    <Provider store={store}>
      <Container />
    </Provider>
  );
}
