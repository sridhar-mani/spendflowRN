import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NativeBaseProvider, Box, Text, Center} from 'native-base';
import {TailwindProvider} from 'nativewind';

function App() {
  return (
    <TailwindProvider>
      <NativeBaseProvider>
        <NavigationContainer>
          <Stack.Navigator>
            {/* Tabs as the main landing */}
            <Stack.Screen
              name="Tabs"
              component={TabNavigator}
              options={{headerShown: false}}
            />
            {/* Full-screen stack */}
            <Stack.Screen
              name="Details"
              component={DetailsScreen}
              options={{title: 'Detail View'}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </NativeBaseProvider>
    </TailwindProvider>
  );
}

export default App;
