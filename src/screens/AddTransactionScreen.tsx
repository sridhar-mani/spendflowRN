import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView, Alert} from 'react-native';
import {View, Text, Card, Colors, TouchableOpacity} from 'react-native-ui-lib';
import tailwind from 'twrnc';
//@ts-ignore
import Ionicons from 'react-native-vector-icons/Ionicons';
import TransactionModal from '../component/TransactionModel';
import useStore from '../store';
import {useTheme} from '../constants/themeContext';

const AddTransactionScreen = () => {
  const {theme, isDarkMode} = useTheme();
  const [dialogVisible, setDialogVisible] = useState(false);
  const {addTransactionToHistory} = useStore() as any;
  const showDialog = (_type: string) => {
    setDialogVisible(true);
  };

  const hideDialog = () => {
    setDialogVisible(false);
  };

  const handleTransactionSubmit = (data: any) => {
    addTransactionToHistory(data);
    setDialogVisible(false);
  };
  // Transaction type cards data with dynamic colors
  const transactionTypes = [
    {
      type: 'expense',
      title: 'Expense',
      color: isDarkMode ? theme.cardBackground : '#ffebee',
      icon: 'arrow-down-outline',
      textColor: theme.expenseColor,
      description: 'Record money going out',
    },
    {
      type: 'income',
      title: 'Income',
      color: isDarkMode ? theme.cardBackground : '#e8f5e8',
      icon: 'arrow-up-outline',
      textColor: theme.incomeColor,
      description: 'Record money coming in',
    },
    {
      type: 'invest',
      title: 'Investment',
      color: isDarkMode ? theme.cardBackground : '#fff3e0',
      icon: 'trending-up-outline',
      textColor: theme.investmentColor,
      description: 'Record investment transactions',
    },
    {
      type: 'savings',
      title: 'Savings',
      color: isDarkMode ? theme.cardBackground : '#e3f2fd',
      icon: 'wallet-outline',
      textColor: theme.savingsColor,
      description: 'Record money set aside',
    },
  ];
  return (
    <SafeAreaView
      style={[
        tailwind`flex-1 h-4/6`,
        {backgroundColor: theme.backgroundSecondary},
      ]}>
      {/* Header */}
      <View
        style={[
          tailwind`px-6 z-10 pt-3 pb-2`,
          {backgroundColor: theme.primary},
        ]}>
        <View style={tailwind`flex-row items-center justify-between mb-2`}>
          <View>
            <Text text40 style={[tailwind`font-bold`, {color: '#FFFFFF'}]}>
              Add Transaction
            </Text>
            <Text
              text70
              style={[tailwind`mt-1 opacity-90`, {color: '#FFFFFF'}]}>
              Record your financial activity
            </Text>
          </View>
          <View
            style={[
              tailwind`w-12 h-12 rounded-full items-center justify-center`,
              {backgroundColor: 'rgba(255, 255, 255, 0.2)'},
            ]}>
            <Ionicons name="add-circle" size={24} color="#FFFFFF" />
          </View>
        </View>
      </View>

      <ScrollView style={tailwind`flex-1  -mt-1 pt-2  px-6 pb-2 `}>
        <Text
          text60
          style={[tailwind`mb-3 font-semibold`, {color: theme.text}]}>
          Select Transaction Type
        </Text>
        <View style={tailwind`mb-1`}>
          {transactionTypes.map(item => (
            <TouchableOpacity
              key={item.type}
              onPress={() => showDialog(item.type)}
              style={tailwind`mb-2`}>
              <Card
                style={tailwind`p-4 rounded-xl flex-row items-center justify-between`}
                backgroundColor={item.color}>
                <View style={tailwind`flex-row items-center`}>
                  <View
                    style={[
                      tailwind`w-12 h-12 rounded-full items-center justify-center mr-4`,
                      {backgroundColor: `${item.textColor}15`},
                    ]}>
                    <Ionicons
                      name={item.icon}
                      size={24}
                      color={item.textColor}
                    />
                  </View>
                  <View>
                    <Text
                      text60
                      style={[tailwind`font-bold`, {color: item.textColor}]}>
                      {item.title}
                    </Text>
                    <Text
                      text80
                      style={[tailwind`mt-1`, {color: item.textColor + 'CC'}]}>
                      {item.description}
                    </Text>
                  </View>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={item.textColor}
                />
              </Card>
            </TouchableOpacity>
          ))}
        </View>{' '}
        <Text
          text60
          style={[tailwind`mb-3 font-semibold`, {color: theme.text}]}>
          Quick Actions
        </Text>
        <Card
          style={[
            tailwind`p-4 mb-4 rounded-xl shadow-sm`,
            {backgroundColor: theme.cardBackground},
          ]}
          backgroundColor={Colors.white}>
          {' '}
          <TouchableOpacity
            style={tailwind`flex-row items-center py-3 border-b border-gray-100`}
            onPress={() => {
              // Navigate to CameraScreen for receipt scanning
              // This will be implemented with a navigation system
              Alert.alert('Coming Soon', 'Camera integration coming soon!');
            }}>
            <Ionicons
              name="receipt-outline"
              size={22}
              color={Colors.blue30}
              style={tailwind`mr-4`}
            />
            <Text text70 color={Colors.grey10}>
              Scan receipt
            </Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={Colors.grey40}
              style={tailwind`ml-auto`}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={tailwind`flex-row items-center py-3`}
            onPress={() => {}}>
            <Ionicons
              name="repeat-outline"
              size={22}
              color={Colors.blue30}
              style={tailwind`mr-4`}
            />
            <Text text70 color={Colors.grey10}>
              Create recurring transaction
            </Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={Colors.grey40}
              style={tailwind`ml-auto`}
            />
          </TouchableOpacity>
        </Card>
      </ScrollView>

      {/* Transaction Dialog Modal */}
      <TransactionModal
        txnId={null}
        visible={dialogVisible}
        hideDialog={hideDialog}
        onSubmitTransaction={handleTransactionSubmit}
      />
    </SafeAreaView>
  );
};

export default AddTransactionScreen;
