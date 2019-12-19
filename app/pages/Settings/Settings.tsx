import React from 'react';
import { ScrollView, View, Linking } from 'react-native';

import Title from 'components/Title';
import ListItem from 'components/ListItem';

import UserPanel from './UserPanel';
import ThemeButton from './ThemeButton';
import CachePanel from './CachePanel';
import styles from './styles';

export default function Settings({ navigation }: { navigation: any }) {
  const report = () => Linking.openURL('https://github.com/nukbal/ruliapp/issues').catch(() => {});
  return (
    <ScrollView>
      <Title label="설정" />
      <UserPanel navigation={navigation} />

      <View style={styles.divide} />

      <ThemeButton />

      <View style={styles.divide} />

      <CachePanel />

      <View style={styles.divide} />

      <ListItem name="bug-report" onPress={report}>
        Report Issues
      </ListItem>

    </ScrollView>
  );
}
