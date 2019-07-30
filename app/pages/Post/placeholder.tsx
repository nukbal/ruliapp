import React, { useContext } from 'react';
import { View } from 'react-native';

import styles from './styles';
import Placeholder from '../Placeholder';
import Comments from './Comments/placeholder';
import ThemeContext from '../../ThemeContext';

export default function PostPlaceholder() {
  const { theme } = useContext(ThemeContext);
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[{ padding: 8, paddingTop: 16 }]}>
        <Placeholder size={200} />
        <Placeholder />
        <Placeholder />
        <Placeholder width="75%" />
      </View>
      <View style={[styles.infoPanel, { flex: 0, backgroundColor: theme.primary, opacity: 0.65, height: 50 }]} />
      <View>
        <Comments />
        <Comments />
        <Comments />
      </View>
    </View>
  );
}
