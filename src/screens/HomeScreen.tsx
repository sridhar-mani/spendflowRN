// HomeScreen.tsx
import React, {useEffect, useState} from 'react';
import {FlatList} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {View, Text, Card, Colors, TouchableOpacity} from 'react-native-ui-lib';
import {useTheme} from '../constants/themeContext';
import tailwind from 'twrnc';
import TransactionModal from '../component/TransactionModel';
import useStore from '../store';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SwipeableTransactionItem from '../component/SwipeableTransactionItem';

export default function HomeScreen({
  goToSettings,
}: {
  goToSettings?: () => void;
}) {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [recTrans, setRecTrans] = useState([]);
  const [editingTxnId, setEditingTxnId] = useState<string | null>(null);
  const {addTransactionToHistory, transactionHistory} = useStore() as any;
  const {theme, isDarkMode, toggleTheme} = useTheme();

  const showDialog = () => setDialogVisible(true);
  const hideDialog = () => {
    setDialogVisible(false);
    setEditingTxnId(null);
  };
  const handleTransactionSubmit = (data: any) => {
    addTransactionToHistory(data);
    // Process transaction data here (e.g., save to database)
  };

  useEffect(() => {
    const recTransacts = () => {
      setRecTrans(
        transactionHistory
          .sort((a: any, b: any) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          })
          .slice(0, 5),
      );
    };
    recTransacts();
  }, [transactionHistory]);

  // Style constants
  const headerGradientColor = '#667eea'; // Kept for light mode, dark mode uses theme.primary

  return (
    <SafeAreaView
      style={[
        tailwind`flex-1`,
        {backgroundColor: theme.background}, // Use theme background
      ]}>
      {/* Modern Header */}
      <View
        style={[
          tailwind`px-4 py-2`, // Reduced header padding further
          {backgroundColor: isDarkMode ? theme.primary : headerGradientColor},
        ]}>
        {/* Header Top Row */}
        <View style={tailwind`flex-row items-center justify-between mb-6`}>
          <View style={tailwind`flex-1`}>
            <Text text70 color={Colors.white} style={tailwind`opacity-80 mb-1`}>
              Total Balance: ₹
              {transactionHistory
                .reduce((sum: number, txn: any) => {
                  const amt =
                    typeof txn.amount === 'string'
                      ? parseFloat(txn.amount)
                      : txn.amount;
                  const multiplier = txn.type === 'expense' ? -1 : 1;
                  return sum + (isNaN(amt) ? 0 : amt * multiplier);
                }, 0)
                .toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
            </Text>
          </View>
          <View style={tailwind`flex-row items-center`}>
            <TouchableOpacity
              onPress={() => toggleTheme()}
              style={tailwind`bg-white bg-opacity-20 rounded-full p-2.5 mr-3`}>
              <Ionicons
                name={isDarkMode ? 'sunny' : 'moon'}
                size={20}
                color={Colors.white}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => goToSettings && goToSettings()}
              style={tailwind`bg-white bg-opacity-20 rounded-full p-2.5`}>
              <Ionicons name="settings-sharp" size={20} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <View style={tailwind`flex-1`}>
        {/* Quick Overview Section */}
        <View style={tailwind`px-4 mb-5 pt-4`}>
          {/* Added pt-4 for spacing */}
          <Text
            text60
            style={[{color: theme.text}, tailwind`mb-4 font-bold ml-1`]}>
            {/* Use theme text color */}
            Quick Overview
          </Text>
          {/* Improved Card Grid */}
          <View style={tailwind`gap-3`}>
            {/* First Row */}
            <View style={tailwind`flex-row gap-3`}>
              {/* Expense Card */}
              <TouchableOpacity
                onPress={() => showDialog()}
                style={tailwind`flex-1`}
                activeOpacity={0.7}>
                <Card
                  style={tailwind`p-4 rounded-2xl h-20 justify-center shadow-sm`}
                  backgroundColor={
                    isDarkMode ? theme.cardBackground : '#fef2f2'
                  } // Theme card background
                >
                  <View style={tailwind`flex-row items-center justify-between`}>
                    <View style={tailwind`flex-1`}>
                      <Text
                        text80
                        style={[
                          {color: isDarkMode ? '#fca5a5' : '#dc2626'},
                          tailwind`font-medium mb-1`,
                        ]} // Adjusted dark mode color
                      >
                        Expenses
                      </Text>
                      <Text
                        text60
                        style={[
                          {color: isDarkMode ? '#f87171' : '#dc2626'},
                          tailwind`font-bold`,
                        ]}>
                        ₹
                        {transactionHistory
                          .filter((txn: any) => txn.type === 'expense')
                          .reduce((sum: number, txn: any) => {
                            const amt =
                              typeof txn.amount === 'string'
                                ? parseFloat(txn.amount)
                                : txn.amount;
                            return sum + (isNaN(amt) ? 0 : amt);
                          }, 0)
                          .toLocaleString('en-IN', {
                            maximumFractionDigits: 0,
                          })}
                      </Text>
                    </View>
                    <View
                      style={tailwind`w-8 h-8 rounded-full items-center justify-center`}
                      backgroundColor={isDarkMode ? '#991b1b' : '#fee2e2'} // Adjusted dark mode icon bg
                    >
                      <Ionicons
                        name="trending-down"
                        size={16}
                        color={isDarkMode ? '#fca5a5' : '#dc2626'} // Adjusted dark mode icon color
                      />
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>

              {/* Income Card */}
              <TouchableOpacity
                onPress={() => showDialog()}
                style={tailwind`flex-1`}
                activeOpacity={0.7}>
                <Card
                  style={tailwind`p-4 rounded-2xl h-20 justify-center shadow-sm`}
                  backgroundColor={
                    isDarkMode ? theme.cardBackground : '#f0fdf4'
                  } // Theme card background
                >
                  <View style={tailwind`flex-row items-center justify-between`}>
                    <View style={tailwind`flex-1`}>
                      <Text
                        text80
                        style={[
                          {color: isDarkMode ? '#86efac' : '#16a34a'},
                          tailwind`font-medium mb-1`,
                        ]} // Adjusted dark mode color
                      >
                        Income
                      </Text>
                      <Text
                        text60
                        style={[
                          {color: isDarkMode ? '#4ade80' : '#16a34a'},
                          tailwind`font-bold`,
                        ]}>
                        ₹
                        {transactionHistory
                          .filter((txn: any) => txn.type === 'income')
                          .reduce((sum: number, txn: any) => {
                            const amt =
                              typeof txn.amount === 'string'
                                ? parseFloat(txn.amount)
                                : txn.amount;
                            return sum + (isNaN(amt) ? 0 : amt);
                          }, 0)
                          .toLocaleString('en-IN', {
                            maximumFractionDigits: 0,
                          })}
                      </Text>
                    </View>
                    <View
                      style={tailwind`w-8 h-8 rounded-full items-center justify-center`}
                      backgroundColor={isDarkMode ? '#166534' : '#dcfce7'} // Adjusted dark mode icon bg
                    >
                      <Ionicons
                        name="trending-up"
                        size={16}
                        color={isDarkMode ? '#86efac' : '#16a34a'}
                      />
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            </View>

            {/* Second Row */}
            <View style={tailwind`flex-row gap-3`}>
              {/* Investments Card */}
              <TouchableOpacity
                onPress={() => showDialog()}
                style={tailwind`flex-1`}
                activeOpacity={0.7}>
                <Card
                  style={tailwind`p-4 rounded-2xl h-20 justify-center shadow-sm`}
                  backgroundColor={
                    isDarkMode ? theme.cardBackground : '#fffbeb'
                  } // Theme card background
                >
                  <View style={tailwind`flex-row items-center justify-between`}>
                    <View style={tailwind`flex-1`}>
                      <Text
                        text80
                        style={[
                          {color: isDarkMode ? '#fcd34d' : '#d97706'},
                          tailwind`font-medium mb-1`,
                        ]} // Adjusted dark mode color
                      >
                        Investments
                      </Text>
                      <Text
                        text60
                        style={[
                          {color: isDarkMode ? '#fbbf24' : '#d97706'},
                          tailwind`font-bold`,
                        ]}>
                        ₹
                        {transactionHistory
                          .filter(
                            (txn: any) =>
                              txn.type === 'investment' ||
                              txn.type === 'invest',
                          )
                          .reduce((sum: number, txn: any) => {
                            const amt =
                              typeof txn.amount === 'string'
                                ? parseFloat(txn.amount)
                                : txn.amount;
                            return sum + (isNaN(amt) ? 0 : amt);
                          }, 0)
                          .toLocaleString('en-IN', {
                            maximumFractionDigits: 0,
                          })}
                      </Text>
                    </View>
                    <View
                      style={tailwind`w-8 h-8 rounded-full items-center justify-center`}
                      backgroundColor={isDarkMode ? '#92400e' : '#fef3c7'} // Adjusted dark mode icon bg
                    >
                      <Ionicons
                        name="analytics"
                        size={16}
                        color={isDarkMode ? '#fcd34d' : '#d97706'}
                      />
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>

              {/* Savings Card */}
              <TouchableOpacity
                onPress={() => showDialog()}
                style={tailwind`flex-1`}
                activeOpacity={0.7}>
                <Card
                  style={tailwind`p-4 rounded-2xl h-20 justify-center shadow-sm`}
                  backgroundColor={
                    isDarkMode ? theme.cardBackground : '#eff6ff'
                  } // Theme card background
                >
                  <View style={tailwind`flex-row items-center justify-between`}>
                    <View style={tailwind`flex-1`}>
                      <Text
                        text80
                        style={[
                          {color: isDarkMode ? '#93c5fd' : '#2563eb'},
                          tailwind`font-medium mb-1`,
                        ]} // Adjusted dark mode color
                      >
                        Savings
                      </Text>
                      <Text
                        text60
                        style={[
                          {color: isDarkMode ? '#60a5fa' : '#2563eb'},
                          tailwind`font-bold`,
                        ]}>
                        ₹
                        {transactionHistory
                          .filter((txn: any) => txn.type === 'savings')
                          .reduce((sum: number, txn: any) => {
                            const amt =
                              typeof txn.amount === 'string'
                                ? parseFloat(txn.amount)
                                : txn.amount;
                            return sum + (isNaN(amt) ? 0 : amt);
                          }, 0)
                          .toLocaleString('en-IN', {
                            maximumFractionDigits: 0,
                          })}
                      </Text>
                    </View>
                    <View
                      style={tailwind`w-8 h-8 rounded-full items-center justify-center`}
                      backgroundColor={isDarkMode ? '#1e40af' : '#dbeafe'} // Adjusted dark mode icon bg
                    >
                      <Ionicons
                        name="wallet"
                        size={16}
                        color={isDarkMode ? '#93c5fd' : '#2563eb'}
                      />
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* Recent Transactions Section */}
        <View style={tailwind`flex-1 px-4 pb-4`}>
          <View
            style={tailwind`flex-row items-center justify-between mb-3 px-1`}>
            {/* Reduced mb from mb-4 to mb-3 */}
            <Text
              text50 // Increased font size from text60 to text50
              style={[{color: theme.text}, tailwind`font-bold`]} // Use theme text color
            >
              Recent Transactions
            </Text>
            <TouchableOpacity
              style={tailwind`px-3 py-1.5 rounded-lg`}
              backgroundColor={
                isDarkMode ? theme.backgroundSecondary : '#e0e7ff'
              } // Corrected: Use theme.backgroundSecondary for dark mode
              activeOpacity={0.7}>
              <Text
                text80
                style={[
                  {color: isDarkMode ? theme.primary : '#2563eb'},
                  tailwind`font-medium`,
                ]}>
                View All
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={recTrans}
            keyExtractor={(item: any) => item.id}
            renderItem={({item}) => (
              <SwipeableTransactionItem
                item={item}
                onEditPress={transaction => {
                  setEditingTxnId(transaction.id);
                  setDialogVisible(true);
                }}
              />
            )}
            contentContainerStyle={tailwind`pb-20`}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Card
                style={tailwind`p-12 items-center rounded-3xl mx-2 shadow-sm mt-4`}
                backgroundColor={theme.cardBackground} // Use theme card background
              >
                <View
                  style={tailwind`w-24 h-24 rounded-full items-center justify-center mb-6`}
                  backgroundColor={
                    isDarkMode ? theme.backgroundSecondary : '#e0e7ff'
                  } // Corrected: Use theme.backgroundSecondary for dark mode
                >
                  <Ionicons
                    name="wallet-outline"
                    size={40}
                    color={isDarkMode ? theme.primary : '#6366f1'} // Theme dependent icon color
                  />
                </View>
                <Text
                  text60
                  style={[{color: theme.text}, tailwind`font-semibold mb-2`]} // Use theme text color
                >
                  No transactions yet
                </Text>
                <Text
                  text80
                  style={[
                    {color: theme.textSecondary},
                    tailwind`text-center leading-5 px-4`,
                  ]} // Use theme secondary text
                >
                  Start tracking your finances by adding your first transaction
                </Text>
              </Card>
            }
          />
        </View>
        {/* Transaction Dialog Modal */}
        <TransactionModal
          txnId={editingTxnId}
          visible={dialogVisible}
          hideDialog={hideDialog}
          onSubmitTransaction={handleTransactionSubmit}
        />
      </View>
    </SafeAreaView>
  );
}
