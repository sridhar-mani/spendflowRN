import React from 'react';
import {View, Text, Card, Colors, Avatar} from 'react-native-ui-lib';
import tailwind from 'twrnc';

interface CardCusProps {
  title?: string;
  subTitle?: string;
  icon?: string;
  iconCol?: string;
  iconStyle?: string;
}

export default function CardCus({
  title = '',
  subTitle = '',
  icon = '',
  iconCol = Colors.primary,
  iconStyle = '',
}: CardCusProps) {
  return (
    <Card
      style={tailwind`rounded-xl w-full overflow-hidden`}
      backgroundColor={Colors.white}>
      <View style={tailwind`flex-row items-center p-3`}>
        {/* Icon on the left */}
        <Avatar
          size={48}
          source={{uri: icon}} // If icon is URL, otherwise use imageSource
          backgroundColor={Colors.grey70}
          labelColor={iconCol}
          label={!icon ? title.charAt(0).toUpperCase() : undefined}
        />

        {/* Text next to icon */}
        <View style={tailwind`ml-3 flex-1`}>
          <Text text70 color={Colors.grey10} style={tailwind`font-bold`}>
            {title}
          </Text>
          {subTitle ? (
            <Text text80 color={Colors.grey30} style={tailwind`mt-1`}>
              {subTitle}
            </Text>
          ) : null}
        </View>
      </View>
    </Card>
  );
}
