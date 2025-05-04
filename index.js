/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import RNAndroidNotificationListener,{RNAndroidNotificationListenerHeadlessJsName } from 'react-native-notification-listener';
import  { gettingNotInfo } from './src/background/notificationTask';

AppRegistry.registerHeadlessTask(RNAndroidNotificationListenerHeadlessJsName, ()=> gettingNotInfo);

AppRegistry.registerComponent(appName, () => App);
