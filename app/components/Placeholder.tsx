import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { getTheme } from 'stores/theme';

const styles = StyleSheet.create({
  container: {
    height: 15,
    width: '100%',
    borderRadius: 4,
    marginBottom: 8,
  },
});

interface Props {
  size?: string | number;
  width?: string | number;
}

export default function Placeholder({ size, width }: Props) {
  const theme = useSelector(getTheme);
  const style: any = { backgroundColor: theme.gray[75] };
  if (size) style.height = size;
  if (width) style.width = width;
  return <View style={[styles.container, style]} />;
}
