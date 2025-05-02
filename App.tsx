// App.tsx
import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {CommonActions, NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  BottomNavigation,
  Provider as PaperProvider,
  MD3LightTheme,
  Portal,
} from 'react-native-paper';  
//@ts-ignore
import Ionicons from 'react-native-vector-icons/Ionicons';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import 'react-native-reanimated';

import {navigations} from './src/constants/componenetList';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <PaperProvider theme={MD3LightTheme}>
          <Portal.Host>
            <NavigationContainer>
              <Tab.Navigator
                initialRouteName="home"
                screenOptions={{headerShown: false}}
                tabBar={({navigation, state, descriptors, insets}) => {
                  // 1️⃣ Build a Paper‐friendly state using your `navigations`:
                  const paperState = {
                    index: state.index,
                    routes: navigations, // <-- your array, with title/focusedIcon/etc
                  };

                  return (
                    <BottomNavigation.Bar
                      navigationState={paperState}
                      safeAreaInsets={insets}
                      // 2️⃣ Render the correct icon per route:
                      renderIcon={({route, focused, color}) => (
                        <Ionicons
                          name={
                            focused ? route.focusedIcon : route.unfocusedIcon
                          }
                          size={20}
                          color={color}
                        />
                      )}
                      // 3️⃣ Show the label:
                      getLabelText={({route}) => route.title}
                      // 4️⃣ When Paper’s pill is tapped, tell RN-Nav to switch tabs:
                      onTabPress={({route}) =>
                        navigation.dispatch(CommonActions.navigate(route.key))
                      }
                    />
                  );
                }}>
                {navigations.map(nav => (
                  <Tab.Screen
                    key={nav.key}
                    name={nav.key} // must match navigations[].key
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
