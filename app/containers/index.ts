import React from 'react';
import { DrawerNavigator } from 'react-navigation';
// @ts-ignore
import BoardScreen from './Board';
// @ts-ignore
import Drawer from './Drawer';

export default DrawerNavigator(
  {
    Main: { screen: BoardScreen },
  },
  {
    contentComponent: Drawer,
    drawerWidth: 300,
  }
);
