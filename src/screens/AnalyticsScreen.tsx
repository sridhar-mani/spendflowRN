import {ColorSliderGroup, Text, View} from 'react-native-ui-lib';
import React from 'react';
import tailwind from 'twrnc';
import {expenseCategories, incomeCategories, months} from '../constants';
import {BarChart, RadarChart} from 'react-native-gifted-charts';
import useStore from '../store';
import {getMonth, getYear, parseISO} from 'date-fns';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';

const AnalyticsScreen = () => {
  const {transactionHistory} = useStore();
  let DATA = [];
  for (let i = 0; i < months.length; i++) {
    DATA.push({
      label: months[i],
      value: transactionHistory
        .filter(
          txn =>
            getMonth(parseISO(txn.date)) === i + 1 &&
            txn.type.toLowerCase() === 'income',
        )
        .reduce((sum, txn) => sum + parseFloat(txn.amount), 0),
      frontColor: 'skyblue',
      spacing: 2,
      labelWidth: 60,
    });
    DATA.push({
      value: transactionHistory
        .filter(
          txn =>
            getMonth(parseISO(txn.date)) === i + 1 &&
            txn.type.toLowerCase() === 'expense',
        )
        .reduce((sum, txn) => sum + parseFloat(txn.amount), 0),
      frontColor: 'orange',
    });
  }


  return (
    <SafeAreaView style={tailwind`bg-gray-50 flex-1`}>
      <Text
        style={tailwind`p-4 pl-6 text-2xl border-b border-gray-200 shadow-sm font-bold`}>
        Analytics
      </Text>



      {transactionHistory.length>0 &&<BarChart data={DATA}/>}

      {transactionHistory.length>0 &&<ScrollView>
       { transactionHistory.filter(
          txn =>
            txn.type.toLowerCase() === 'expense',
        ).reduce((sum, txn) => sum + parseFloat(txn.amount), 0) === 0 && <RadarChart
          hideAsterLines
          hideGrid
          data={incomeCategories.map(each =>
            transactionHistory
              .filter(txn => txn.category.toLowerCase() === each)
              .reduce((sum, txn) => sum + parseFloat(txn.amount), 0) || 0
          )}
          labels={incomeCategories}
          
        />}
        {transactionHistory
        .filter(
          txn =>
            txn.type.toLowerCase() === 'income',
        )
        .reduce((sum, txn) => sum + parseFloat(txn.amount), 0) === 0 && <RadarChart
          hideAsterLines
          hideGrid
          data={expenseCategories.map(each =>
            transactionHistory
              .filter(txn => txn.category.toLowerCase() === each)
              .reduce((sum, txn) => sum + parseFloat(txn.amount), 0) || 0
          )}
          labels={expenseCategories}
        />}
      </ScrollView>}
{transactionHistory.length === 0 &&      <View centerV centerH style={tailwind`flex-1`}>
<Text  text40BL>
  No Transactions
</Text>
      </View>}
  </SafeAreaView>
  );
};

export default AnalyticsScreen;
