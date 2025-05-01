import {View} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import tailwind from 'twrnc';
import {
  Card,
  Text,
  IconButton,
  Chip,
  Divider,
  Searchbar,
  Button,
  Menu,
  Avatar,
  Checkbox,
} from 'react-native-paper';
import {Slider} from 'react-native-ui-lib';

const SettingsScreen = () => {
  return (
    <SafeAreaView style={tailwind`flex-1 bg-gray-50`}>
      <View style={tailwind`flex-1`}>
        <Text
          style={tailwind`text-2xl font-bold p-4  border-b border-gray-200 shadow-sm`}>
          Settings
        </Text>
        <View
          style={tailwind` flex-row items-center justify-between  p-3 px-15`}>
          <Text style={tailwind`text-xl font-bold`}>Enable Expense Alert</Text>
          <Checkbox status="checked"></Checkbox>
        </View>
        <View style={tailwind`flex-col `}>
          <View
            style={tailwind` flex-row items-center justify-between  p-3 px-15`}>
            <Text style={tailwind`text-xl font-bold`}>
              Target Savings % (Per Month)
            </Text>
            <Slider value={0} minimumValue={0} maximumValue={100}></Slider>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;
