import React from 'react';
import { StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    height: 15,
    flex: 1,
    backgroundColor: 'rgba(100, 100, 100, 0.25)',
    borderRadius: 2,
    opacity: 0.25,
    marginBottom: 8,
  },
});

interface Props {
  size?: string | number;
  width?: string | number;
}

export default function Placeholder({ size, width }: Props) {
  return <View style={[styles.container, { height: size, width }]} />;
}
