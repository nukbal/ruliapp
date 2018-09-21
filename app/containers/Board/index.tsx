import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { primary } from '../../styles/color';
import BoardScreen from './Board';
import PostScreen from '../Post';

const styles = StyleSheet.create({
  headerLeft: {
    marginLeft: 12,
  },
  headerRight: {
    marginRight: 12,
  }
});

export default createStackNavigator({
  Board: {
    screen: BoardScreen,
    navigationOptions: {
      headerBackTitle: null,
    },
  },
  Post: {
    screen: PostScreen,
    drawerLockMode: 'locked-closed',
  },
}, {
  navigationOptions: ({ navigation }) => {
    return {
      headerStyle: {
        backgroundColor: primary,
      },
      headerTitleStyle: {
        color: 'white',
      },
      cardStyle: {
        opacity: 1,
      },
      headerLeft: (
        <TouchableOpacity onPress={navigation.toggleDrawer}>
          <Icon style={styles.headerLeft} name="menu" size={24} color="white" />
        </TouchableOpacity>
      ),
      drawerLockMode: (navigation.state.routeName === 'Board' ? 'unlocked' : 'locked-closed'),
    };
  },
});
