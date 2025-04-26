import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigation';
import BottomBar from './component/BottomBar';
// import {SystemBars} from 'react-native-edge-to-edge';

function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {/* <SystemBars style={'dark'}/> */}
    <AppNavigator/>
    <BottomBar/>

    </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
