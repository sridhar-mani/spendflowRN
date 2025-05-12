import {View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import tailwind from 'twrnc';
import {
  Card,
  Text,
  IconButton,
  Chip,
  Divider,
  Searchbar,
  Menu,
  Avatar,
} from 'react-native-paper';

import {
  Checkbox,
  Button,
  NumberInput,
  Slider,
  TextField,
  ButtonSize,
} from 'react-native-ui-lib';
import {ScrollView} from 'react-native-gesture-handler';
import useStore from '../store';

const SettingsScreen = () => {
  const {settings, setSettings} = useStore();
  const [localSettings, setLocalSettings] = useState(settings);
  const [showMenu, setShowMenu] = useState(false);
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);
  console.log(settings);

  const optionsEn = !showMenu ? tailwind`opacity-50` : '';

  return (
    <SafeAreaView style={tailwind`flex-1 bg-gray-50`}>
      <View style={tailwind`flex-1`}>
        <Text
          style={tailwind`text-2xl font-bold p-4  border-b border-gray-200 shadow-sm`}>
          Settings
        </Text>

        <ScrollView style={[tailwind`flex-col h-20 `, optionsEn]}>
          <View
            style={tailwind` flex-row items-center justify-between h-20 p-3 px-15`}>
            <Text style={tailwind`text-xl font-bold`}>
              Enable Expense Alert
            </Text>
            <Checkbox value={showMenu} onValueChange={setShowMenu}></Checkbox>
          </View>
          <View style={tailwind` flex items-start justify-between  p-3 px-15`}>
            <Text style={tailwind`text-xl font-bold`}>
              Target Savings % (Per Month)
            </Text>
            <TextField
              label="Target Savings %"
              keyboardType="numeric"
              maxLength={3}
              floatingPlaceholder
              value={String(localSettings.savings)}
              onChangeText={text => {
                const digits = text.replace(/[^0-9]/g, '');
                const num = Math.max(0, Number(digits));
                setLocalSettings({...localSettings, savings: num});
              }}
              validateOnChange={true}
              style={tailwind`text-xl font-bold text-center text-gray-800`}
              fieldStyle={tailwind`border-b border-gray-400 w-full pb-1`}
              validate={['number', v => Number(v) >= 0 && Number(v) <= 100]}
              validationMessage={['Must be a number', 'Must be between 0–100']}
            />
          </View>
          <View style={tailwind` flex items-start justify-between  p-3 px-15`}>
            <Text style={tailwind`text-xl font-bold`}>
              Target Investment % (Per Month)
            </Text>
            <TextField
              label="Target Investment %"
              keyboardType="numeric"
              maxLength={3}
              floatingPlaceholder
              value={String(localSettings.invests)}
              onChangeText={text => {
                const digits = text.replace(/[^0-9]/g, '');
                const num = Math.min(100, Math.max(0, Number(digits)));

                setLocalSettings({...localSettings, invests: num});
              }}
              validateOnChange={true}
              style={tailwind`text-xl font-bold text-center text-gray-800`}
              fieldStyle={tailwind`border-b border-gray-400 w-full pb-1`}
              validate={['number', v => Number(v) >= 0 && Number(v) <= 100]}
              validationMessage={['Must be a number', 'Must be between 0–100']}
            />
          </View>
          <View style={tailwind` flex items-start justify-between  p-3 px-15`}>
            <Text style={tailwind`text-xl font-bold`}>Savings Goal</Text>
            <TextField
              label="Savings Goal"
              keyboardType="numeric"
              maxLength={30}
              floatingPlaceholder
              value={String(localSettings.savingsGoal)}
              onChangeText={text => {
                const digits = text.replace(/[^0-9]/g, '');
                const num = Math.max(0, Number(digits));
                setLocalSettings({...localSettings, savingsGoal: num});
              }}
              style={tailwind`text-xl font-bold text-center text-gray-800`}
              fieldStyle={tailwind`border-b border-gray-400 w-full pb-1`}
              validationMessage={['Must be a number', 'Must be between 0–100']}
            />
          </View>
          <Button
            label={'Save'}
            size={Button.sizes.medium}
            disabled={!showMenu}
            style={{
              height: 50,
              width: '50%',
              alignSelf: 'center',
              margin: 20,
            }}></Button>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;
