import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ThemeContext from '../ThemeContext';

const styles = StyleSheet.create({
  container: {
    paddingLeft: 8,
    paddingBottom: 18,
    paddingRight: 18,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
});

export default function Title({ label }: { label: string; }) {
  const { theme } = useContext(ThemeContext);
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text numberOfLines={2} style={[styles.title, { color: theme.text }]}>{label}</Text>
    </View>
  );
}
