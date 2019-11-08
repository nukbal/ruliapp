import React from 'react';
import { View, StyleSheet } from 'react-native';
import Text from './Text';

const styles = StyleSheet.create({
  container: {
    minHeight: 52,
    paddingLeft: 8,
    paddingRight: 16,
    paddingTop: 4,
  },
  title: {
    letterSpacing: -0.6,
    fontWeight: 'bold',
  },
});

export default function Title({ label }: { label: string; }) {
  return (
    <View style={styles.container}>
      <Text
        style={[styles.title]}
        shade={900}
        size={600}
        numberOfLines={2}
      >
        {label}
      </Text>
    </View>
  );
}
