import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import tailwind from 'twrnc';
import {theme} from '../../tailwind.config';
import {useTheme} from '../constants/themeContext';
import {Text} from 'react-native-ui-lib';

function SpendingMapScreen() {
  const {theme, isDarkMode} = useTheme();
  return (
    <SafeAreaView
      style={[tailwind`flex-1`, {backgroundColor: theme.backgroundSecondary}]}>
      <Text>Spending Map</Text>
    </SafeAreaView>
  );
}

export default SpendingMapScreen;
