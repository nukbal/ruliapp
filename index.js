import 'react-native-gesture-handler';
import { AppRegistry, unstable_enableLogBox } from 'react-native';
import { enableScreens } from 'react-native-screens';
import App from './app/index.tsx';

enableScreens();
unstable_enableLogBox();
AppRegistry.registerComponent('ruliapp', () => App);
