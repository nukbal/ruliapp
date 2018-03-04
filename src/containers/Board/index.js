import React, { PureComponent } from 'react';
import { StackNavigator, DrawerNavigator } from 'react-navigation';
import { StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { darkBarkground, background, titleText, border } from '../../styles/color';
import Board from './Board';
import DetailScreen from '../Detail';
import BoardList from '../../config/BoardList';

const styles = StyleSheet.create({
  header: {
    marginLeft: 12,
  },
});

const BoardRoutes = {};
const setScreen = (params) => (props) => <Board {...props} {...params} />
Object.keys(BoardList).map(key => {
  const { title, params } = BoardList[key];
  BoardRoutes[key] = { screen: setScreen(params), navigationOptions: { title } };
});

const drawerConfig = {
  initialRouteName: 'BestHumorBoard',
  navigationOptions: {
    drawerStyle: {
      backgroundColor: darkBarkground,
    }
  },
  headerLeft: (
    <Ionicons
      style={styles.header}
      name="ios-list"
      size={28}
      color="white"
      onPress={() => navigation.navigate('DrawerToggle')}
    />
  ),
}

const BoardDrawer = DrawerNavigator(BoardRoutes, drawerConfig);

export default StackNavigator({
  Board: { screen: BoardDrawer },
  Detail: { screen: DetailScreen },
}, {
  navigationOptions: ({ navigation }) => ({
    headerStyle: {
      backgroundColor: darkBarkground,
      borderBottomColor: border,
      borderBottomWidth: 1,
    },
    headerTitleStyle: {
      color: titleText,
    },
    cardStyle: {
      opacity: 1,
    },
  }),
});
