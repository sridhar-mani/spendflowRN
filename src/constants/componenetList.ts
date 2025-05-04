import HomeScreen from '../screens/HomeScreen';
import HistoryScreen from '../screens/HistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';

const navigations = [
  {
    key: 'home',
    title: 'Home',
    focusedIcon: 'home',
    unfocusedIcon: 'home-outline',
    component: HomeScreen,
  },
  {
    key: 'history',
    title: 'History',
    focusedIcon: 'book',
    unfocusedIcon: 'book-outline',
    component: HistoryScreen,
  },
  // {
  //   key: 'analytics',
  //   title: 'Analytics',
  //   focusedIcon: 'bar-chart',
  //   unfocusedIcon: 'bar-chart-outline',
  //   component: AnalyticsScreen,
  // },
  // {
  //   key: 'settings',
  //   title: 'Settings',
  //   focusedIcon: 'settings',
  //   unfocusedIcon: 'settings-outline',
  //   component: SettingsScreen,
  // },
];

export {navigations};
