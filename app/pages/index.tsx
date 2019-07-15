import { createStackNavigator } from 'react-navigation';
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
  headerMode: 'none',
});
