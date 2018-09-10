import { createDrawerNavigator } from 'react-navigation';
import BoardStack from './containers/Board';
import DrawerScreen from './containers/Drawer';

export default createDrawerNavigator(
  {
    Board: { screen: BoardStack },
  },
  {
    contentComponent: DrawerScreen,
    backBehavior: 'none',
  }
);
