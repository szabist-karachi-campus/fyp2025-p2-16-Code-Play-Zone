/**
 * @format
 */

AppRegistry.registerComponent(appName, () => App);
import { AppRegistry } from 'react-native';
import Main from './src/Main'; // The file where you placed the provided code
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => Main);
