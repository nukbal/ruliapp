import { createDrawerNavigator } from 'react-navigation';
import BoardStack from './Board';
import DrawerScreen from './Drawer';

export default createDrawerNavigator(
  {
    Board: { screen: BoardStack },
  },
  {
    contentComponent: DrawerScreen,
    backBehavior: 'none',
  }
);
