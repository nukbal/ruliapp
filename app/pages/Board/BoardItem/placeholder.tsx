import React from 'react';
import { View } from 'react-native';

import Placeholder from 'app/components/Placeholder';

import styles from './styles';

export default function BoardPlaceholder() {
  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Placeholder width="80%" />
      </View>
      <View style={styles.info}>
        <Placeholder width="50%" />
      </View>
    </View>
  );
}
