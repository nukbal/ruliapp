import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';

import ThemeContext from '../ThemeContext';
import ProgressBar from './ProgressBar';

export default function AppendLoading() {
  const { theme } = useContext(ThemeContext);
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
