import {View} from 'react-native';
import {Text} from 'react-native-ui-lib';
import React from 'react';
import tailwind from 'twrnc';
import {months} from '../constants';
import {BarChart} from 'react-native-gifted-charts';
import useStore from '../store';
import {getMonth, parseISO} from 'date-fns';

const AnalyticsScreen = () => {
  const {transactionHistory} = useStore();
  const DATA = months.map((mon, ind) => ({
    label: mon,
    value: transactionHistory
      .filter(
        txn =>
          getMonth(parseISO(txn.date)) === ind + 1 &&
          txn.type.toLowerCase() === 'expense',
      )
      .reduce((sum, txn) => sum + parseFloat(txn.amount), 0),
    income: transactionHistory
      .filter(
        txn =>
          getMonth(parseISO(txn.date)) === ind + 1 &&
          txn.type.toLowerCase() === 'income',
      )
      .reduce((sum, txn) => sum + parseFloat(txn.amount), 0),
  }));

  return (
    <View style={tailwind`bg-gray-50 flex-1`}>
      <Text
        style={tailwind`p-4 pl-6 text-2xl border-b border-gray-200 shadow-sm font-bold`}>
        Analytics
      </Text>
      <BarChart data={DATA} />
    </View>
  );
};

export default AnalyticsScreen;
