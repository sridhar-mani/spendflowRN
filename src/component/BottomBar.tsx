import {View} from 'react-native';
import React from 'react';
import tw from 'twrnc';
import {navigations} from '../constants';
import {NavigationProp} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import {Button} from 'react-native-paper';

const BottomBar = () => {
  const nav = useNavigation<NavigationProp<any>>();
  return (
    <View style={tw`h-12 w-full flex-row`}>
      {navigations.map(each => (
        <Button
          icon="camera"
          mode="contained"
          onPress={() => console.log('Pressed')}>
          Press me
        </Button>
      ))}
    </View>
  );
};

export default BottomBar;
