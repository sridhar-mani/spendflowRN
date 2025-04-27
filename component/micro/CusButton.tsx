import {  Text, Pressable } from 'react-native';
import React from 'react';
import tw from 'twrnc';
import { CusButtonProps } from '../../types';
import Animated,{useAnimatedStyle} from 'react-native-reanimated';

const CusButton = ({title,onPress,variant='primary'}:CusButtonProps) => {

    const [pressed, setPressed] = React.useState(false);
    // const animatedStyle = useAnimatedStyle(()=>({
    //     transform: [{ scale: pressed ? 0.95 : 1 }],
    // }))

  return (
    <Pressable onPressIn={()=>setPressed(true)} onPressOut={()=>setPressed(false)} onPress={onPress}>
      {/* <Animated.View style={[
          tw.style(
            `px-4 py-2 rounded-lg ${variant === 'primary' ? 'bg-blue-500' : 'bg-gray-500'}`
          ),
          animatedStyle,
      ]}>  */}
      <Text style={tw`text-white text-center font-semibold`}>{title}</Text>
      {/* </Animated.View> */}
    </Pressable>
  )
}

export default CusButton;
