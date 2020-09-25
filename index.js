/**
 * @format
 */
import './App/Config/index';
import './App/Config/ReactotronConfig';
import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from './App/App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
