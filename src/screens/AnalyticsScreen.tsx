import {View} from 'react-native';
import {Text} from 'react-native-ui-lib';
import React from 'react';
import tailwind from 'twrnc';
import {CartesianChart, Line} from 'victory-native';
import {months} from '../constants';
import useStore from '../store';
import {getMonth, getYear, parseISO} from 'date-fns';

const AnalyticsScreen = () => {
  const {transactionHistory} = useStore();
  const DATA = months.map((mon, ind) => ({
    month: mon,
    expense: transactionHistory
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
      <CartesianChart data={DATA} xKey={'month'} yKeys={['expense', 'income']}>
        {({points}) => (
          <Line points={points.expense} color={'red'} strokeWidth={3}></Line>
        )}
      </CartesianChart>
    </View>
  );
};

export default AnalyticsScreen;
