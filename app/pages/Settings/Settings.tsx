import React, { useContext } from 'react';
import { StyleSheet, ScrollView, View, Text, Linking, TouchableHighlight } from 'react-native';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { NavigationScreenProp } from 'react-navigation';

import ThemeContext from 'app/ThemeContext';
import Title from 'app/components/Title';
import UserPanel from './UserPanel';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
  },
  item: {
    height: 48,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  const { isDark, theme, toggleTheme } = useContext(ThemeContext);

  const report = () => Linking.openURL('https://github.com/nukbal/ruliapp/issues').catch(() => {});

  const itemStyle = [styles.item, { backgroundColor: theme.background }];

  return (
    <ScrollView style={{ backgroundColor: theme.background }}>
      <Title label="설정" />

      <UserPanel navigation={navigation} />

      <View style={styles.divide} />

      <TouchableHighlight
        style={itemStyle}
        underlayColor={theme.primaryHover}
        onPress={toggleTheme}
      >
        <>
          <View style={styles.itemHeader}>
            <Icons name="filter-hdr" size={24} color={theme.label} style={styles.iconStyle} />
            <Text style={[styles.itemText, { color: theme.text }]}>
              테마
            </Text>
          </View>
          <Text style={[styles.itemText, { color: theme.label }]}>{isDark ? '다크' : '라이트'}</Text>
        </>
      </TouchableHighlight>

      <View style={styles.divide} />

      <TouchableHighlight
        style={[...itemStyle, styles.itemHeader]}
        underlayColor={theme.primaryHover}
        onPress={report}
      >
        <>
          <Icons name="bug-report" size={24} color={theme.label} style={styles.iconStyle} />
          <Text style={[styles.itemText, { color: theme.text }]}>Report Issues</Text>
        </>
      </TouchableHighlight>

    </ScrollView>
  );
}
