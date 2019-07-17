import React, { useContext } from 'react';
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
    fontWeight: 'bold',
  },
});

export default function Header({ navigation }: { navigation: NavigationScreenProp<any> }) {
  const { theme, toggleTheme, isDark } = useContext(ThemeContext);
  const back = () => navigation.goBack();

  if (Platform.OS === 'ios') {
    StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content');
  }

  let headerHeight = getStatusBarHeight();
  if (Platform.OS === 'ios') {
    if (!Platform.isPad) {
      headerHeight += 32;
    } else {
      headerHeight += 44;
    }
  } else if (Platform.OS === 'android') {
    headerHeight = 56;
  } else {
    headerHeight = 64;
  }

  return (
    <View style={[styles.container, { height: headerHeight, backgroundColor: theme.background }]}>
      {!navigation.isFirstRouteInParent() && (
        <TouchableOpacity onPress={back}>
          <Icons name="chevron-left" size={24} color={theme.primary} />
        </TouchableOpacity>
      )}
      <Text style={[styles.title, { color: theme.primary }]} numberOfLines={1}>
        {navigation.getParam('title', '')}
      </Text>
      {/* <TouchableOpacity onPress={toggleTheme}>
        <Icons name="brightness-medium" size={24} color={theme.primary} />
      </TouchableOpacity> */}
    </View>
  );
}
