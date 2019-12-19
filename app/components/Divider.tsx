import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { getTheme } from 'stores/theme';

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
  },
});

export default function Divider() {
  const theme = useSelector(getTheme);
  return <View style={[styles.container, { borderColor: theme.gray[300] }]} />;
}
