import { View, Text, Button } from 'react-native';
import React from 'react';
import tw from 'twrnc';
import { navigations } from '../constants';
import { NavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
const BottomBar = () => {
    const nav = useNavigation<NavigationProp<any>>();
  return (
    <View style={tw`h-12 flex w-full flex-col`}>
      {
        navigations.map((each) => (
          <Button key={each} title={each} onPress={() => nav.navigate(each)} />
        ))
      }
    </View>
  );
};


export default BottomBar;
