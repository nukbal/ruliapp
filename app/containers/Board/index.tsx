import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

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
  Post: { screen: PostScreen },
}, {
  navigationOptions: ({ navigation }) => ({
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
        <FontAwesome style={styles.headerLeft} name="navicon" size={20} color="white" />
      </TouchableOpacity>
    ),
    headerRight: (
      <TouchableOpacity>
        <FontAwesome style={styles.headerRight} name="pencil-square-o" size={20} color="white" />
      </TouchableOpacity>
    ),
  }),
});
