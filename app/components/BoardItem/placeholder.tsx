import React from 'react';
import { View } from 'react-native';
import styles from './styles';

export default function BoardPlaceholder() {
  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <View style={[styles.placeholder, { width: '80%' }]} />
      </View>
      <View style={styles.info}>
        <View style={[styles.placeholder, { width: '45%' }]} />
      </View>
    </View>
  );
}
