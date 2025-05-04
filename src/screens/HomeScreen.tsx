// HomeScreen.tsx
import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  ScrollView,
  Platform,
  StatusBar,
  FlatList,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {FAB, Surface} from 'react-native-paper';
import tw from 'twrnc';
import CardCus from '../component/CardCus';
import {homeButsTop, incomeCategories} from '../constants';
import TransactionModal from '../component/TransactionModel';
import useStore from '../store';
import TransactionItem from '../component/TransactionItem';
import {MotiView} from 'moti';

export default function HomeScreen() {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [recTrans, setRecTrans] = useState([]);
  const {addTransactionToHistory, transactionHistory, deleteTransaction} =
    useStore();

    console.log( transactionHistory
      .filter(txn => txn.category.toLowerCase() === 'expense')
      .reduce((sum, txn) => sum + parseFloat(txn.amount), 0), transactionHistory
      .filter(txn => txn.category.toLowerCase() === 'income')
      .reduce((sum, txn) => sum + parseFloat(txn.amount), 0));

  // Calculate additional padding for Android status bar
  const statusBarHeight =
    Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

  const showDialog = () => setDialogVisible(true);
  const hideDialog = () => setDialogVisible(false);

  const handleTransactionSubmit = data => {
    console.log('Transaction data:', data);
    addTransactionToHistory(data);
    // Process transaction data here (e.g., save to database)
  };

  useEffect(() => {
    const recTransacts = () => {
      setRecTrans(
        transactionHistory
          .sort((a, b) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          })
          .slice(0, 5),
      );
    };
    recTransacts();
  }, []);


  return (
    <SafeAreaView
      style={tw`flex-1 bg-gray-100 `}>
      <View
        style={[
          tw`flex-1 relative `,
      
        ]}>
        <Surface elevation={1} style={tw`p-3 m-3 bg-white  rounded-2xl`}>
          <View style={tw`flex-row flex-wrap mb-1 -mx-2`}>
            {homeButsTop.map((each, i) => (
              <View
                key={each.title + each.subTitle}
                style={tw`w-1/2 px-2 ${i < 2 ? 'mb-4' : ''}`}>
                <CardCus
                  {...each}
                  subTitle={
                    '₹ ' +
                    transactionHistory
                      .filter(txn => txn.type === each.title.toLowerCase())
                      .reduce((sum, txn) => {
                        const amt =
                          typeof txn.amount === 'string'
                            ? parseFloat(txn.amount)
                            : txn.amount;
                        return sum + (isNaN(amt) ? 0 : amt);
                      }, 0)
                      .toFixed(2)
                  }
                />
              </View>
            ))}
          </View>
        </Surface>
        <FlatList
          stickyHeaderHiddenOnScroll={false}
          data={recTrans}
          keyExtractor={item => item.id}
          renderItem={({item}) => <TransactionItem item={item} />}
          style={tw`p-3`}
          // ListHeaderComponent={renderGridHeader}
          contentContainerStyle={tw`pb-20`}
          showsVerticalScrollIndicator={false}></FlatList>

        {/* FAB button to open dialog */}
        <FAB
          icon="plus"
          onPress={showDialog}
          color='black'
          style={tw`absolute bottom-4 right-4 text-re bg-gray-100 shadow-lg`}
        />

        {/* Transaction Dialog Modal */}
        <TransactionModal
          visible={dialogVisible}
          hideDialog={hideDialog}
          onSubmitTransaction={handleTransactionSubmit}
        />
      </View>
    </SafeAreaView>
  );
}
