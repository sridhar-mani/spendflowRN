import React from 'react';
import {View} from 'react-native';
import {Avatar, Card, Text} from 'react-native-paper';
import tw from 'twrnc';

export default function CardCus({
  title = '',
  subTitle = '',
  icon = '',
  iconCol = '',
  iconStyle = '',
}) {
  return (
    <Card style={tw`rounded-xl w-full  overflow-hidden`}>
      <Card.Content style={tw`flex-row items-center p-0`}>
        {/* Icon on the left */}
        <Avatar.Icon
          size={56}
          icon={icon}
          style={tw`bg-transparent  ${iconStyle}`}
          color={iconCol}
        />

        {/* Text next to icon */}
        <View style={tw`ml-2`}>
          <Text style={tw`text-base font-bold`}>{title}</Text>
          {subTitle ? (
            <Text style={tw`text-sm text-gray-600`}>{subTitle}</Text>
          ) : null}
        </View>
      </Card.Content>
    </Card>
  );
}
