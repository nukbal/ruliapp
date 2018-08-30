import React from 'react';
import { View } from 'react-native';
import styles from './styles';

export default function CommentPlaceholder() {
  return (
    <View style={styles.container}>
      <View style={styles.UserContainer}>
        <View style={[styles.placeholder, { width: '30%' }]} />
      </View>
      <View style={styles.CommentContainer}>
        <View style={[styles.placeholder, { width: '85%' }]} />
        <View style={[styles.placeholder, { width: '65%' }]} />
      </View>
      <View style={styles.infoContainer}>
        <View style={[styles.placeholder, { width: '30%' }]} />
      </View>
    </View>
  );
}
