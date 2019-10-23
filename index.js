import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import { useScreens } from 'react-native-screens';
import App from './app/index.tsx';

useScreens();

AppRegistry.registerComponent('ruliapp', () => App);
