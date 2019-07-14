import React from 'react';
import { View } from 'react-native';
import { Container } from './index';
import Placeholder from '../../Placeholder';
import styles from './styles';

export default function BoardPlaceholder() {
  return (
    <Container>
      <>
        <View style={styles.info}>
          <Placeholder width="80%" />
        </View>
        <View style={styles.info}>
          <Placeholder width="50%" />
        </View>
      </>
    </Container>
  );
}
