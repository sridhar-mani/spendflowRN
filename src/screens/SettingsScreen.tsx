import {View} from 'react-native';
import React, {useState} from 'react';
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
import {Slider, TextField} from 'react-native-ui-lib';

const SettingsScreen = () => {
  const [settings, setSettings] = useState({
    savings: 0,
    invests: 0,
    savingsGoal: 0,
    expenseAlert: false,
  });

  const optionsEn = settings.expenseAlert ? tailwind`opacity-50` : '';

  return (
    <SafeAreaView style={tailwind`flex-1 bg-gray-50`}>
      <View style={tailwind`flex-1`}>
        <Text
          style={tailwind`text-2xl font-bold p-4  border-b border-gray-200 shadow-sm`}>
          Settings
        </Text>
        <View
          style={tailwind` flex-row items-center justify-between h-20 p-3 px-15`}>
          <Text style={tailwind`text-xl font-bold`}>Enable Expense Alert</Text>
          <Checkbox
            status={settings.expenseAlert ? 'checked' : 'unchecked'}
            onPress={() =>
              setSettings({...settings, expenseAlert: !settings.expenseAlert})
            }></Checkbox>
        </View>
        <View style={[tailwind`flex-col h-20 `, optionsEn]}>
          <View
            style={tailwind` flex-row items-center justify-between  p-3 px-15`}>
            <Text style={tailwind`text-xl font-bold`}>
              Target Savings % (Per Month)
            </Text>
            <TextField
              editable={!settings.expenseAlert}
              onChange={value =>
                setSettings({...settings, savings: Number(value)})
              }
              style={tailwind`w-20 h-10 text-xl font-bold text-center`}
              fieldStyle={tailwind`border-b   border-black w-20`}
              enableErrors
              keyboardType="numeric"
              maxLength={3}
              validate={[
                'number',
                value => Number(value) >= 0 && Number(value) <= 100,
              ]}
              validationMessage={[
                'Must be a number',
                'Must be between 0-100 ',
              ]}></TextField>
          </View>
        </View>
        <View style={[tailwind`flex-col h-20 `, optionsEn]}>
          <View
            style={tailwind` flex-row items-center justify-between  p-3 px-15`}>
            <Text style={tailwind`text-xl font-bold`}>
              Target Investment % (Per Month)
            </Text>
            <TextField
              onChange={value =>
                setSettings({...settings, invests: Number(value)})
              }
              editable={!settings.expenseAlert}
              style={tailwind`w-20 h-10 text-xl font-bold text-center`}
              fieldStyle={tailwind`border-b   border-black w-20`}
              enableErrors
              maxLength={3}
              keyboardType="numeric"
              validate={[
                'number',
                value => Number(value) >= 0 && Number(value) <= 100,
              ]}
              validationMessage={[
                'Must be a number',
                'Must be between 0-100 ',
              ]}></TextField>
          </View>
        </View>
        <View style={[tailwind`flex-col h-20 `, optionsEn]}>
          <View
            style={tailwind` flex-row items-center justify-between  p-3 px-15`}>
            <Text style={tailwind`text-xl font-bold`}>Savings Goal</Text>
            <TextField
              editable={!settings.expenseAlert}
              onChange={value =>
                setSettings({...settings, savingsGoal: Number(value)})
              }
              style={tailwind`w-20 h-10 text-xl font-bold text-center`}
              fieldStyle={tailwind`border-b   border-black w-20`}
              enableErrors
              keyboardType="numeric"
              maxLength={10}
              validate={[
                'number',
                value => Number(value) >= 0 && Number(value) <= 1000000000,
              ]}
              validationMessage={['Must be a number', '']}></TextField>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;
