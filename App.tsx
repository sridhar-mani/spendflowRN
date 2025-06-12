import React, {useEffect, useState} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {View, Text, Colors, Badge, TouchableOpacity} from 'react-native-ui-lib';
import tailwind from 'twrnc';
import {StatusBar} from 'react-native';

//@ts-ignore
import Ionicons from 'react-native-vector-icons/Ionicons';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import 'react-native-reanimated';
import {navigations} from './src/constants/componenetList';
import RNAndroidNotificationListener from 'react-native-notification-listener';
import {startForegroundService} from './src/background/notificationService';
import {checkNotifeePer} from './src/utils/utils';
import {ThemeProvider, useTheme} from './src/constants/themeContext';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import AddTransactionScreen from './src/screens/AddTransactionScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import SettingsScreen from './src/screens/SettingsScreen';

export default function App() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const requestPermission = async () => {
      const notifeePerm = await checkNotifeePer();
      if (notifeePerm === 'denied' || notifeePerm === 'unknown') {
        RNAndroidNotificationListener.requestPermission();
        startForegroundService();
      }
    };
    requestPermission();
  }, []);

  const renderTabIcon = (navigation: any, index: number) => {
    const isSelected = selectedIndex === index;
    const iconName = isSelected
      ? navigation.focusedIcon
      : navigation.unfocusedIcon;

    // Special handling for "Add" button in the middle
    if (navigation.key === 'camera') {
      return (
        <View style={tailwind`items-center justify-center`}>
          <View
            style={tailwind`w-12 h-12 rounded-full bg-blue-500 items-center justify-center -mt-5 shadow-md`}>
            <Ionicons name={iconName} size={28} color={Colors.white} />
          </View>
          <Text
            text90
            color={isSelected ? Colors.primary : Colors.grey40}
            style={tailwind`mt-1 text-xs`}>
            {navigation.title}
          </Text>
        </View>
      );
    }

    return (
      <View style={tailwind`items-center justify-center py-1`}>
        <Ionicons
          name={iconName}
          size={22}
          color={isSelected ? Colors.primary : Colors.grey40}
        />
        <Text
          text90
          color={isSelected ? Colors.primary : Colors.grey40}
          style={tailwind`mt-1 text-xs font-medium`}>
          {navigation.title}
        </Text>
      </View>
    );
  };

  const screens = [
    HomeScreen,
    HistoryScreen,
    AddTransactionScreen,
    SettingsScreen,
    AnalyticsScreen,
  ];

  const CurrentScreen = screens[selectedIndex];

  return (
    <ThemeProvider>
      <AppContent
        CurrentScreen={CurrentScreen}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
        renderTabIcon={renderTabIcon}
      />
    </ThemeProvider>
  );
}

// Themed App Content
function AppContent({
  CurrentScreen,
  selectedIndex,
  setSelectedIndex,
  renderTabIcon,
}: any) {
  const {isDarkMode, theme} = useTheme();

  // Apply theme styles
  const containerStyle = isDarkMode
    ? tailwind`flex-1 bg-gray-900`
    : tailwind`flex-1 bg-white`;

  const tabBarStyle = isDarkMode
    ? tailwind`flex-row bg-gray-900 border-t border-gray-800 px-2 pt-2 pb-2 shadow-lg`
    : tailwind`flex-row bg-white border-t border-gray-100 px-2 pt-2 pb-2 shadow-lg`;

  const selectedTabStyle = (index: number) => {
    const isSelected = selectedIndex === index;
    if (isDarkMode) {
      return isSelected ? tailwind`bg-gray-800 rounded-xl` : '';
    }
    return isSelected ? tailwind`bg-blue-50 rounded-xl` : '';
  };

  return (
    <GestureHandlerRootView style={tailwind`flex-1`}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? theme.background : theme.background}
      />
      <SafeAreaProvider>
        <View style={containerStyle}>
          {/* Main Content Area */}
          <View style={tailwind`flex-1`}>
            {selectedIndex === 0 ? (
              <CurrentScreen goToSettings={() => setSelectedIndex(3)} />
            ) : (
              <CurrentScreen />
            )}
          </View>

          {/* Modern Bottom Tab Bar */}
          <View style={tabBarStyle}>
            {navigations.map((nav, index) => (
              <TouchableOpacity
                key={nav.key}
                onPress={() => setSelectedIndex(index)}
                style={[
                  tailwind`flex-1 items-center justify-center py-1 mx-1`,
                  selectedTabStyle(index),
                ]}>
                {renderTabIcon(nav, index)}
                {nav.key === 'camera' && (
                  <Badge
                    size={6}
                    backgroundColor={Colors.red30}
                    style={tailwind`absolute top-1 right-1/4`}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
