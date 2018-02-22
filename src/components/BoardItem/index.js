import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    padding: 8,
    marginBottom: 8,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default class BoardItem extends Component {
  render() {
    return (
      <TouchableOpacity>
        <View style={styles.container}>
          <Text>{item.title}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}
