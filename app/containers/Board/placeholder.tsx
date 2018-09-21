import React from 'react';
import { View, StyleSheet } from 'react-native';
import Item from '../../components/BoardItem/placeholder';
import SearchBar from '../../components/SearchBar';
import { darkBarkground } from '../../styles/color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkBarkground,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
});

export default function Placeholder() {
  return (
    <View style={styles.container}>
      <SearchBar onSubmit={() => null} />
      <Item />
      <Item />
      <Item />
      <Item />
      <Item />
      <Item />
      <Item />
    </View>
  );
}
