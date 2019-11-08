import React, { useContext } from 'react';
import { View } from 'react-native';

import Placeholder from 'app/components/Placeholder';
import ThemeContext from 'app/ThemeContext';

import styles from './styles';
import Comments from './Comments/placeholder';

export default function PostPlaceholder() {
  const { theme } = useContext(ThemeContext);
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[{ padding: 8, paddingTop: 16 }]}>
        <Placeholder size={32} />
      </View>
      <View style={[{ padding: 8, paddingTop: 16 }]}>
        <Placeholder size={200} />
        <Placeholder />
        <Placeholder />
        <Placeholder width="75%" />
      </View>
      <View style={[{ flex: 0, backgroundColor: theme.primary[600], opacity: 0.65, height: 50 }]} />
      <View>
        <Comments />
        <Comments />
        <Comments />
      </View>
    </View>
  );
}
