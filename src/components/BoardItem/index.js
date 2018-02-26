import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    padding: 8,
    marginBottom: 8,
    backgroundColor: 'white',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    flexDirection: 'row',
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    flexWrap:'wrap',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  itemText: {
    marginLeft: 8,
  }
});

export default class BoardItem extends Component {
  onPress = () => {
    const { onPress, id } = this.props;
    if (!onPress) return;

    onPress(id);
  }

  render() {
    const { title, comments, author, like, views, times, likes } = this.props;
    return (
      <TouchableOpacity onPress={this.onPress}>
        <View style={styles.container}>
          <Text>{title}</Text>
          <View style={styles.info}>
            <View style={styles.item}>
              <Ionicons name="ios-text-outline" size={25} color="grey" />
              <Text style={styles.itemText}>{comments || 0}</Text>
            </View>
            <View style={styles.item}>
              <Ionicons name="ios-thumbs-up-outline" size={25} color="grey" />
              <Text style={styles.itemText}>{likes || 0}</Text>
            </View>
            <View style={styles.item}>
              <Ionicons name="ios-eye-outline" size={25} color="grey" />
              <Text style={styles.itemText}>{views || 0}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
