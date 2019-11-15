import React, { useEffect } from 'react';
import { TouchableOpacity, Platform, StatusBar } from 'react-native';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { getTheme, getThemeMode } from 'app/stores/theme';

import BoardStack from './Board';
import BoardList from './BoardList';
import PostScreen from './Post';

import Settings from './Settings/Settings';
import Login from './Settings/Login';

const Root = createNativeStackNavigator();

let marginTop: number | undefined;
let marginRight: number | undefined;
if (Platform.OS === 'ios') {
  marginTop = 60;
  if (Platform.isPad) {
    marginTop = 75;
  }
} else {
  marginRight = 8;
}

export default function Router() {
  const theme = useSelector(getTheme);
  const mode = useSelector(getThemeMode);
  // const [width, setWidth] = useState(Dimensions.get('window').width);

  useEffect(() => {
    StatusBar.setBarStyle(['black', 'dark'].indexOf(mode) !== -1 ? 'light-content' : 'dark-content');
    // function changeHandler({ window }: any) {
    //   setWidth(window.width);
    // }
    // Dimensions.addEventListener('change', changeHandler);
    // return () => {
    //   Dimensions.removeEventListener('change', changeHandler);
    // };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Root.Navigator
      initialRouteName="main"
      screenOptions={{
        headerHideShadow: true,
        headerStyle: {
          backgroundColor: theme.gray[50],
        },
        headerTitle: '',
        headerBackTitle: '',
        contentStyle: {
          marginTop,
          backgroundColor: theme.gray[50],
        },
      }}
    >
      <Root.Screen
        name="main"
        component={BoardList}
        options={({ navigation }) => ({
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('settings')}
              style={{ marginRight }}
            >
              <Icons name="tune" size={24} color={theme.primary[600]} />
            </TouchableOpacity>
          ),
        })}
      />
      <Root.Screen name="board" component={BoardStack} />
      <Root.Screen
        name="post"
        component={PostScreen}
        options={{
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {}}
              style={{ marginRight }}
            >
              <Icons name="more-vert" size={24} color={theme.primary[600]} />
            </TouchableOpacity>
          ),
        }}
      />
      <Root.Screen name="settings" component={Settings} />
      <Root.Screen name="login" component={Login} options={{ headerBackTitle: '설정' }} />
    </Root.Navigator>
  );
}
