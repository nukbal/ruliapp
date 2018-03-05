import { StackNavigator } from 'react-navigation';
import BoardScreen from './Board';
import SettingsScreen from './Settings';

export default StackNavigator(
  {
    Board: { screen: BoardScreen },
    Settings: { screen: SettingsScreen },
  },
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    }
  }
);
