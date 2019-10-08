import React from 'react';
import { View } from 'react-native';

import Placeholder from 'app/components/Placeholder';
import styles from './styles';

export default function CommentPlaceholder() {
  return (
    <View style={[styles.container, { flex: 0, height: 135 }]}>
      <View style={styles.UserContainer}>
        <Placeholder width="30%" />
      </View>
      <View style={[styles.UserContainer, { flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' }]}>
        <Placeholder width="85%" />
        <Placeholder width="65%" />
      </View>
      <View style={styles.infoContainer}>
        <Placeholder width="25%" />
      </View>
    </View>
  );
}
