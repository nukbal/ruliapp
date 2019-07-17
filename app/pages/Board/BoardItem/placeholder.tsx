import React, { useContext } from 'react';
import { View } from 'react-native';
import Placeholder from '../../Placeholder';
import styles from './styles';
import ThemeContext from '../../../ThemeContext';

export default function BoardPlaceholder() {
  const { theme } = useContext(ThemeContext);
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.info}>
        <Placeholder width="80%" />
      </View>
      <View style={styles.info}>
        <Placeholder width="50%" />
      </View>
    </View>
  );
}
