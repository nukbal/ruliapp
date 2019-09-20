import React, { useContext } from 'react';
import { StyleSheet, ScrollView, View, Text, Linking } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { NavigationScreenProp } from 'react-navigation';
import ThemeContext from '../../ThemeContext';
import AuthContext, { Actions } from '../../AuthContext';

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
  const { isLogined, userInfo, dispatch } = useContext(AuthContext);

  const report = () => Linking.openURL('https://github.com/nukbal/ruliapp/issues').catch(() => {});
  const login = () => navigation.navigate('Login');
  const logout = () => dispatch(Actions.clear());

  return (
    <ScrollView style={{ backgroundColor: theme.background }}>

      <Text style={[styles.label, { color: theme.primary }]}>계정</Text>
      {!isLogined && (
        <TouchableOpacity style={[styles.item, { borderColor: theme.border }]} onPress={login}>
          <View style={styles.itemHeader}>
            <Icons name="account-circle" size={24} color={theme.label} style={styles.iconStyle} />
            <Text style={[styles.itemText, { color: theme.text }]}>
              로그인
            </Text>
          </View>
          <Icons name="arrow-forward" size={24} color={theme.label} />
        </TouchableOpacity>
      )}
      {isLogined && (
        <>
          <View style={[styles.item, styles.itemHeader, { borderColor: theme.border }]}>
            <Text style={[styles.itemText, { color: theme.text }]}>
              {userInfo.name}
              님
            </Text>
          </View>
          <View style={[styles.item, styles.itemHeader, { borderColor: theme.border }]}>
            <Text style={[styles.itemText, { color: theme.text }]}>
              {userInfo.attends}일
            </Text>
          </View>
          <TouchableOpacity style={[styles.item, { borderColor: theme.border }]} onPress={logout}>
            <View style={styles.itemHeader}>
              <Icons name="exit-to-app" size={24} color={theme.label} style={styles.iconStyle} />
              <Text style={[styles.itemText, { color: theme.text }]}>
                로그아웃
              </Text>
            </View>
            <Icons name="arrow-forward" size={24} color={theme.label} />
          </TouchableOpacity>
        </>
      )}

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
