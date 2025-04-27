import { View, Button } from 'react-native';
import React from 'react';
import tw from 'twrnc';
import { navigations } from '../constants';
import { NavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

import CusButton from './micro/CusButton';
const BottomBar = () => {
    const nav = useNavigation<NavigationProp<any>>();
  return (
    <View style={tw`h-12 w-full flex-row`}>
      {
        navigations.map((each) => (
          <CusButton key={each} title={each} onPress={() => nav.navigate(each)} />
        ))
      }
    </View>
  );
};


export default BottomBar;
