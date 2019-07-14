import React from 'react';
import { View } from 'react-native';

import styles from './styles';
import { styles as ContentStyle } from './Contents';
import Placeholder from '../Placeholder';

export default function PostPlaceholder() {
  return (
    <View>
      <View style={styles.title}>
        <Placeholder size={20} width="65%" />
        <Placeholder width="45%" />
      </View>
      <View style={[ContentStyle.container, { paddingTop: 16, paddingBottom: 16 }]}>
        <Placeholder size={200} />
        <Placeholder />
        <Placeholder />
        <Placeholder width="75%" />
      </View>
    </View>
  );
}
