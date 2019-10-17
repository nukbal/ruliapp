import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import ThemeContext from 'app/ThemeContext';

const styles = StyleSheet.create({
  container: {
    minHeight: 52,
    paddingLeft: 8,
    paddingRight: 16,
    paddingTop: 4,
  },
  title: {
    fontSize: 28,
    letterSpacing: -0.6,
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
