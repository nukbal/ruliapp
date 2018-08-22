import { DrawerNavigator } from 'react-navigation';
import BoardScreen from './Board';
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
