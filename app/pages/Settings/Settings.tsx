import React from 'react';
import { ScrollView, View, Text, Linking, TouchableHighlight } from 'react-native';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';

import { getTheme } from 'app/stores/theme';
import Title from 'app/components/Title';

import UserPanel from './UserPanel';
import ThemeButton from './ThemeButton';
import styles from './styles';

export default function Settings({ navigation }: { navigation: any }) {
  const theme = useSelector(getTheme);

  const report = () => Linking.openURL('https://github.com/nukbal/ruliapp/issues').catch(() => {});
  return (
    <ScrollView>
      <Title label="설정" />
      <UserPanel navigation={navigation} />

      <View style={styles.divide} />

      <ThemeButton />

      <View style={styles.divide} />

      <TouchableHighlight
        style={[styles.item, styles.itemHeader]}
        underlayColor={theme.gray[500]}
        onPress={report}
      >
        <>
          <Icons name="bug-report" size={20} color={theme.gray[800]} style={styles.iconStyle} />
          <Text style={[styles.itemText, { color: theme.gray[800] }]}>Report Issues</Text>
        </>
      </TouchableHighlight>

    </ScrollView>
  );
}
