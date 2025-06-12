import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import tailwind from 'twrnc';
import {
  View,
  Text,
  Card,
  Colors,
  Switch,
  TextField,
  TouchableOpacity,
  Toast,
} from 'react-native-ui-lib';
import {ScrollView, Alert} from 'react-native';
//@ts-ignore
import Ionicons from 'react-native-vector-icons/Ionicons';
import useStore from '../store';
import {exportAllData, importData} from '../utils/dataExport';
import {useTheme} from '../constants/themeContext';

const SettingsScreen = () => {
  const {settings, setSettings} = useStore() as any;
  const {theme, isDarkMode} = useTheme();
  const [localSettings, setLocalSettings] = useState(settings);
  const [enableExpenseAlert, setEnableExpenseAlert] = useState(false);
  const [darkMode, setDarkMode] = useState(settings?.darkMode || false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);
  const handleSaveSettings = () => {
    const updatedSettings = {
      ...localSettings,
      darkMode,
      enableExpenseAlert,
    };
    setSettings(updatedSettings);
    Alert.alert(
      'Settings Saved',
      'Your settings have been updated successfully!',
      [{text: 'OK'}],
    );
  };
  const SettingCard = ({
    icon,
    title,
    subtitle,
    children,
    iconColor = theme.primary,
  }: any) => (
    <Card
      style={tailwind`mx-4 mb-4 rounded-xl shadow-sm`}
      backgroundColor={theme.cardBackground}>
      <View style={tailwind`p-4`}>
        <View style={tailwind`flex-row items-center mb-4`}>
          <View
            style={[
              tailwind`w-12 h-12 rounded-xl items-center justify-center mr-4`,
              {backgroundColor: `${iconColor}20`},
            ]}>
            <Ionicons name={icon} size={24} color={iconColor} />
          </View>
          <View style={tailwind`flex-1`}>
            <Text text60 style={[tailwind`font-bold`, {color: theme.text}]}>
              {title}
            </Text>
            <Text text80 style={[tailwind`mt-1`, {color: theme.textSecondary}]}>
              {subtitle}
            </Text>
          </View>
        </View>
        {children}
      </View>
    </Card>
  );
  return (
    <SafeAreaView
      style={[tailwind`flex-1`, {backgroundColor: theme.backgroundSecondary}]}>
      <View style={tailwind`flex-1`}>
        {/* Modern Header */}
        <View
          style={[
            tailwind`px-6 pt-4 pb-6`,
            {backgroundColor: theme.headerBackground},
          ]}>
          <View style={tailwind`flex-row items-center justify-between`}>
            <View style={tailwind`flex-1`}>
              <Text
                text40
                style={[tailwind`font-bold mb-1`, {color: '#FFFFFF'}]}>
                Settings
              </Text>
              <Text text80 style={[tailwind`opacity-90`, {color: '#FFFFFF'}]}>
                Personalize your SpendFlow experience
              </Text>
            </View>
            <View
              style={[
                tailwind`w-12 h-12 rounded-2xl items-center justify-center`,
                {backgroundColor: 'rgba(255, 255, 255, 0.2)'},
              ]}>
              <Ionicons name="cog" size={22} color="#FFFFFF" />
            </View>
          </View>
        </View>
        <ScrollView
          style={tailwind`flex-1 -mt-4`}
          showsVerticalScrollIndicator={false}>
          {/* Expense Alert Setting */}
          <SettingCard
            icon="notifications"
            title="Expense Alerts 🔔"
            subtitle="Get notified when expenses exceed limits"
            iconColor="#f093fb">
            <View
              style={tailwind`flex-row items-center justify-between p-4 bg-gray-50 rounded-2xl`}>
              <View style={tailwind`flex-1`}>
                <Text
                  text70
                  color={Colors.grey10}
                  style={tailwind`font-semibold`}>
                  Enable Notifications
                </Text>
                <Text text80 color={Colors.grey40}>
                  Alert when spending exceeds budget
                </Text>
              </View>
              <Switch
                value={enableExpenseAlert}
                onValueChange={setEnableExpenseAlert}
                onColor="#f093fb"
              />
            </View>
          </SettingCard>

          {/* Target Savings */}
          <SettingCard
            icon="wallet"
            title="Savings Target 💰"
            subtitle="Set your monthly savings goal"
            iconColor="#20bf6b">
            <View style={tailwind`p-4 bg-gray-50 rounded-2xl`}>
              <TextField
                placeholder="Enter percentage (0-100)"
                keyboardType="numeric"
                maxLength={3}
                value={String(localSettings.savings || 0)}
                onChangeText={(text: string) => {
                  const digits = text.replace(/[^0-9]/g, '');
                  const num = Math.max(0, Math.min(100, Number(digits)));
                  setLocalSettings({...localSettings, savings: num});
                }}
                fieldStyle={tailwind`bg-white rounded-xl px-4 py-4 border-0`}
              />
              <Text text80 color={Colors.grey40} style={tailwind`mt-2`}>
                Percentage (%)
              </Text>
            </View>
          </SettingCard>

          {/* Target Investment */}
          <SettingCard
            icon="trending-up"
            title="Investment Target 📈"
            subtitle="Set your monthly investment goal"
            iconColor="#fd79a8">
            <View style={tailwind`p-4 bg-gray-50 rounded-2xl`}>
              <TextField
                placeholder="Enter percentage (0-100)"
                keyboardType="numeric"
                maxLength={3}
                value={String(localSettings.invests || 0)}
                onChangeText={(text: string) => {
                  const digits = text.replace(/[^0-9]/g, '');
                  const num = Math.max(0, Math.min(100, Number(digits)));
                  setLocalSettings({...localSettings, invests: num});
                }}
                fieldStyle={tailwind`bg-white rounded-xl px-4 py-4 border-0`}
              />
              <Text text80 color={Colors.grey40} style={tailwind`mt-2`}>
                Percentage (%)
              </Text>
            </View>
          </SettingCard>

          {/* Savings Goal */}
          <SettingCard
            icon="cash"
            title="Savings Goal 🎯"
            subtitle="Your target savings amount"
            iconColor="#00d2d3">
            <View style={tailwind`p-4 bg-gray-50 rounded-2xl`}>
              <TextField
                placeholder="Enter amount"
                keyboardType="numeric"
                maxLength={10}
                value={String(localSettings.savingsGoal || 0)}
                onChangeText={(text: string) => {
                  const digits = text.replace(/[^0-9]/g, '');
                  const num = Math.max(0, Number(digits));
                  setLocalSettings({...localSettings, savingsGoal: num});
                }}
                fieldStyle={tailwind`bg-white rounded-xl px-4 py-4 border-0`}
              />
              <Text text80 color={Colors.grey40} style={tailwind`mt-2`}>
                Amount in ₹
              </Text>
            </View>
          </SettingCard>

          {/* App Settings */}
          <SettingCard
            icon="apps"
            title="App Preferences 🎨"
            subtitle="Customize app behavior"
            iconColor="#a55eea">
            <View>
              <TouchableOpacity
                style={tailwind`flex-row items-center justify-between p-4 bg-gray-50 rounded-2xl mb-3`}>
                <View style={tailwind`flex-row items-center flex-1`}>
                  <Ionicons
                    name="moon"
                    size={20}
                    color="#a55eea"
                    style={tailwind`mr-3`}
                  />
                  <Text text70 color={Colors.grey10}>
                    Dark Mode
                  </Text>
                </View>
                <Switch
                  value={darkMode}
                  onValueChange={value => {
                    setDarkMode(value);
                    setLocalSettings({...localSettings, darkMode: value});
                  }}
                  onColor="#a55eea"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={tailwind`flex-row items-center justify-between p-4 bg-gray-50 rounded-2xl mb-3`}>
                <View style={tailwind`flex-row items-center flex-1`}>
                  <Ionicons
                    name="language-outline"
                    size={20}
                    color="#a55eea"
                    style={tailwind`mr-3`}
                  />
                  <Text text70 color={Colors.grey10}>
                    Language
                  </Text>
                </View>
                <View style={tailwind`flex-row items-center`}>
                  <Text text80 color={Colors.grey40} style={tailwind`mr-2`}>
                    English
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={Colors.grey40}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={tailwind`flex-row items-center justify-between p-4 bg-gray-50 rounded-2xl`}>
                <View style={tailwind`flex-row items-center flex-1`}>
                  <Ionicons
                    name="information-circle"
                    size={20}
                    color="#a55eea"
                    style={tailwind`mr-3`}
                  />
                  <Text text70 color={Colors.grey10}>
                    About App
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={Colors.grey40}
                />
              </TouchableOpacity>
            </View>
          </SettingCard>

          {/* Data Management - New section for offline app */}
          <SettingCard
            icon="save"
            title="Data Management 💾"
            subtitle="Backup and restore your data"
            iconColor="#6c5ce7">
            <View>
              <TouchableOpacity
                onPress={async () => {
                  try {
                    const result = await exportAllData();
                    Alert.alert(
                      result.success ? 'Success' : 'Error',
                      result.message,
                    );
                  } catch (error) {
                    Alert.alert(
                      'Error',
                      'Failed to export data: ' + error.message,
                    );
                  }
                }}
                style={tailwind`flex-row items-center justify-between p-4 bg-gray-50 rounded-2xl mb-3`}>
                <View style={tailwind`flex-row items-center flex-1`}>
                  <Ionicons
                    name="download-outline"
                    size={20}
                    color="#6c5ce7"
                    style={tailwind`mr-3`}
                  />
                  <Text text70 color={Colors.grey10}>
                    Export Data
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={Colors.grey40}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  try {
                    const result = await importData();
                    Alert.alert(
                      result.success ? 'Success' : 'Error',
                      result.message,
                    );
                  } catch (error) {
                    Alert.alert(
                      'Error',
                      'Failed to import data: ' + error.message,
                    );
                  }
                }}
                style={tailwind`flex-row items-center justify-between p-4 bg-gray-50 rounded-2xl`}>
                <View style={tailwind`flex-row items-center flex-1`}>
                  <Ionicons
                    name="cloud-upload-outline"
                    size={20}
                    color="#6c5ce7"
                    style={tailwind`mr-3`}
                  />
                  <Text text70 color={Colors.grey10}>
                    Import Data
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={Colors.grey40}
                />
              </TouchableOpacity>
            </View>
          </SettingCard>
          {/* Save Button */}
          <View style={tailwind`px-4 pb-8 pt-4`}>
            <TouchableOpacity
              onPress={handleSaveSettings}
              style={tailwind`rounded-xl p-4 shadow-lg items-center justify-center bg-blue-500`}>
              <View style={tailwind`flex-row items-center justify-center`}>
                <Ionicons
                  name="save-outline"
                  size={20}
                  color={Colors.white}
                  style={tailwind`mr-2`}
                />
                <Text text70 color={Colors.white} style={tailwind`font-bold`}>
                  Save Changes
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;
