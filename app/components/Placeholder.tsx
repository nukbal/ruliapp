import React from 'react';
import { StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    height: 15,
    width: '100%',
    backgroundColor: 'rgba(100, 100, 100, 0.25)',
    borderRadius: 4,
    marginBottom: 8,
  },
});

interface Props {
  size?: string | number;
  width?: string | number;
}

export default function Placeholder({ size, width }: Props) {
  const style: any = {};
  if (size) style.height = size;
  if (width) style.width = width;
  return <View style={[styles.container, style]} />;
}
