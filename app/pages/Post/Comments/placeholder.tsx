import React from 'react';
import { View } from 'react-native';
import Placeholder from '../../Placeholder';
import styles from './styles';

export default function CommentPlaceholder() {
  return (
    <View style={styles.container}>
      <View style={styles.UserContainer}>
        <Placeholder width="30%" />
      </View>
      <View style={styles.CommentContainer}>
        <Placeholder width="85%" />
        <Placeholder width="65%" />
      </View>
      <View style={styles.infoContainer}>
        <Placeholder width="25%" />
      </View>
    </View>
  );
}
