import React, { useContext } from 'react';
import { View } from 'react-native';

import styles from './styles';
import Placeholder from '../Placeholder';
import ThemeContext from '../../ThemeContext';

export default function PostPlaceholder() {
  const { theme } = useContext(ThemeContext);
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[{ paddingTop: 16, paddingBottom: 16 }]}>
        <Placeholder size={200} />
        <Placeholder />
        <Placeholder />
        <Placeholder width="75%" />
      </View>
    </View>
  );
}
