import React, { useContext, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Text, Linking, Alert } from 'react-native';
import SafeView from 'react-native-safe-area-view';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { NavigationScreenProp } from 'react-navigation';
import ThemeContext from '../../ThemeContext';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingTop: 8,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 18,
    flex: 1,
    fontWeight: 'bold',
  },
  item: {
    height: 45,
    paddingHorizontal: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  iconStyle: {
    paddingRight: 10,
  },
  label: {
    paddingVertical: 15,
    paddingLeft: 15,
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  itemText: {
    fontWeight: '500',
    alignItems: 'center',
  },
  boldText: {
    fontWeight: '600',
  },
});

export default function Settings({ navigation }: { navigation: NavigationScreenProp<any> }) {
  const { isDark, theme, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    navigation.setParams({ title: '설정' });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const report = () => Linking.openURL('https://github.com/nukbal/ruliapp/issues').catch(() => {});
  const login = () => Alert.alert('아직 준비중인 기능입니다.');

  return (
    <ScrollView style={{ backgroundColor: theme.background }}>
      <Text style={[styles.label, { color: theme.primary }]}>계정</Text>
      <TouchableOpacity style={[styles.item, { borderColor: theme.border }]} onPress={login}>
        <View style={styles.itemHeader}>
          <Icons name="account-circle" size={24} color={theme.label} style={styles.iconStyle} />
          <Text style={[styles.itemText, { color: theme.text }]}>
            로그인
          </Text>
        </View>
        <Icons name="arrow-forward" size={24} color={theme.label} />
      </TouchableOpacity>
      <Text style={[styles.label, { color: theme.primary }]}>표시</Text>
      <TouchableOpacity style={[styles.item, { borderColor: theme.border }]} onPress={toggleTheme}>
        <View style={styles.itemHeader}>
          <Icons name="filter-hdr" size={24} color={theme.label} style={styles.iconStyle} />
          <Text style={[styles.itemText, { color: theme.text }]}>
            테마
          </Text>
        </View>
        <Text style={[styles.itemText, { color: theme.label }]}>{isDark ? '다크' : '라이트'}</Text>
      </TouchableOpacity>
      <Text style={[styles.label, { color: theme.primary }]}>기타</Text>
      <TouchableOpacity style={[styles.item, styles.itemHeader, { borderColor: theme.border }]} onPress={report}>
        <Icons name="bug-report" size={24} color={theme.label} style={styles.iconStyle} />
        <Text style={[styles.itemText, { color: theme.text }]}>Report Issues</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
