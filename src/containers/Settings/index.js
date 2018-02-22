import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class Settings extends PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <Text>Settings Screen</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

