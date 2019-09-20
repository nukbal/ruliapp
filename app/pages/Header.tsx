import React, { useContext, useMemo } from 'react';
import { StyleSheet, View, Text, Platform, StatusBar } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { getStatusBarHeight } from 'react-native-safe-area-view';
import ThemeContext from '../ThemeContext';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 18,
    flex: 1,
    fontWeight: 'bold',
  },
});

export default function Header({ navigation }: { navigation: NavigationScreenProp<any> }) {
  const { theme, isDark } = useContext(ThemeContext);
  const back = () => navigation.goBack();

  if (Platform.OS === 'ios') {
    StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content');
  }

  const openSetting = () => navigation.navigate('Settings');

  const statusBarHeight = useMemo(getStatusBarHeight, []);
  let headerHeight = 0;
  if (Platform.OS === 'ios') {
    if (!Platform.isPad) {
      headerHeight = 38;
    } else {
      headerHeight = 44;
    }
  } else if (Platform.OS === 'android') {
    headerHeight = 56;
  } else {
    headerHeight = 64;
  }

  const headStyle = {
    height: (statusBarHeight + headerHeight),
    backgroundColor: theme.background,
    paddingTop: statusBarHeight,
  };

  return (
    <View style={[styles.container, headStyle]}>
      {!navigation.isFirstRouteInParent() && (
        <TouchableOpacity onPress={back}>
          <Icons name="chevron-left" size={24} color={theme.primary} />
        </TouchableOpacity>
      )}
      <Text style={[styles.title, { color: theme.primary }]} numberOfLines={1}>
        {navigation.getParam('title', '')}
      </Text>
      {navigation.state.routeName !== 'Settings' && (
        <TouchableOpacity onPress={openSetting}>
          <Icons name="tune" size={24} color={theme.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
}
