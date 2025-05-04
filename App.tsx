// App.tsx
import React, { useEffect } from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {CommonActions, NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  BottomNavigation,
  MD3LightTheme,
  Provider as PaperProvider,
  Portal,
} from 'react-native-paper';

//@ts-ignore
import Ionicons from 'react-native-vector-icons/Ionicons';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import 'react-native-reanimated';
import {colorPalette} from './src/constants/colorTheme';
import {navigations} from './src/constants/componenetList';
import RNAndroidNotificationListener  from 'react-native-notification-listener';
import { startForegroundService } from './src/background/notificationService';
import { checkNotifeePer } from './src/utils/utils';

const Tab = createBottomTabNavigator();

export default function App() {

  
  useEffect(() => {
    const requestPermission = async () => {
      const notifeePerm = await checkNotifeePer();
      if(( notifeePerm ==='denied' ||  notifeePerm ==='unknown')){
        RNAndroidNotificationListener.requestPermission();
        startForegroundService();
      }
    };
    requestPermission();
  }, []);

  

    
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <PaperProvider theme={{...colorPalette.light}}>
          <Portal.Host>
            <NavigationContainer>
              <Tab.Navigator
                initialRouteName="home"
                screenOptions={{headerShown: false}}
                tabBar={({navigation, state, descriptors, insets}) => {
                  const paperState = {
                    index: state.index,
                    routes: navigations, 
                  };

                  return (
                    <BottomNavigation.Bar
                      navigationState={paperState}
                      safeAreaInsets={insets}
                      renderIcon={({route, focused, color}) => (
                        <Ionicons
                          name={
                            focused ? route.focusedIcon : route.unfocusedIcon
                          }
                          size={20}
                          color={color}
                        />
                      )}
                      getLabelText={({route}) => route.title}
                      onTabPress={({route}) =>
                        navigation.dispatch(CommonActions.navigate(route.key))
                      }
                    />
                  );
                }}>
                {navigations.map(nav => (
                  <Tab.Screen
                    key={nav.key}
                    name={nav.key} 
                    component={nav.component}
                  />
                ))}
              </Tab.Navigator>
            </NavigationContainer>
          </Portal.Host>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
