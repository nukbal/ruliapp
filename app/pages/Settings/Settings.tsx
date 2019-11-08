import React, { useContext } from 'react';
import { StyleSheet, ScrollView, View, Text, Linking, TouchableHighlight } from 'react-native';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { NavigationScreenProp } from 'react-navigation';

import ThemeContext from 'app/ThemeContext';
import UserPanel from './UserPanel';
import ThemeButton from './ThemeButton';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
  },
  item: {
    height: 48,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    marginBottom: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  iconStyle: {
    paddingRight: 32,
  },
  itemText: {
    fontWeight: '500',
    alignItems: 'center',
  },
  divide: {
    marginBottom: 25,
  },
});

export default function Settings({ navigation }: { navigation: NavigationScreenProp<any> }) {
  const { theme } = useContext(ThemeContext);

  const report = () => Linking.openURL('https://github.com/nukbal/ruliapp/issues').catch(() => {});
  return (
    <ScrollView>
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
