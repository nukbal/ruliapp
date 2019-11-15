import React from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';

import Placeholder from 'app/components/Placeholder';
import { getTheme } from 'app/stores/theme';

import styles from './styles';
import Comments from './Comments/placeholder';

export default function PostPlaceholder() {
  const theme = useSelector(getTheme);
  return (
    <View style={[styles.container, { backgroundColor: theme.gray[50] }]}>
      <View style={[{ padding: 8, paddingTop: 16 }]}>
        <Placeholder size={32} />
      </View>
      <View style={[{ padding: 8, paddingTop: 16 }]}>
        <Placeholder size={200} />
        <Placeholder />
        <Placeholder />
        <Placeholder width="75%" />
      </View>
      <View style={[{ flex: 0, backgroundColor: theme.gray[75], opacity: 0.65, height: 50 }]} />
      <View>
        <Comments />
        <Comments />
        <Comments />
      </View>
    </View>
  );
}
