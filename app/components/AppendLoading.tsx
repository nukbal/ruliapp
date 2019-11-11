import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { getTheme } from 'app/stores/theme';
import ProgressBar from './ProgressBar';

export default function AppendLoading() {
  const theme = useSelector(getTheme);
  return (
    <View style={styles.container}>
      <ProgressBar indetermate color={theme.primary[400]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 75,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
