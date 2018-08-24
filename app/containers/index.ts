import { createDrawerNavigator } from 'react-navigation';
import BoardStack from './Board';
import DrawerScreen from './Drawer';

export default createDrawerNavigator({
  Main: { screen: BoardStack },
  Drawer: { screen: DrawerScreen },
});
