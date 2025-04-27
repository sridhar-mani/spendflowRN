import {  Text, Pressable } from 'react-native';
import React from 'react';
import tw from 'twrnc';
import { CusButtonProps } from '../../types';


const CusButton = ({title,onPress,variant='primary'}:CusButtonProps) => {
  return (
    <Pressable onPress={onPress} style={({pressed})=>
        tw.style(`px-4 py-2 hover:shadow-md active:scale-0.9 rounded-md ${variant === 'primary' ? 'bg-blue-500' : 'bg-gray-500'}`,pressed && 'opacity-70 transition-all duration-300 scale-95')

    }>
      <Text style={tw`text-white text-base`}>{title}</Text>
    </Pressable>
  )
}

export default CusButton;
