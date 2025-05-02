import React from 'react';
import HomeScreen from '../screens/HomeScreen';
import HistoryScreen from '../screens/HistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';

const navigations = [
  {
    key: 'home',
    title: 'Home',
    focusedIcon: 'home',
    unfocusedIcon: 'home-outline',
    component: HomeScreen,
  },
  {
    key: 'history',
    title: 'History',
    focusedIcon: 'book',
    unfocusedIcon: 'book-outline',
    component: HistoryScreen,
  },
  {
    key: 'analytics',
    title: 'Analytics',
    focusedIcon: 'bar-chart',
    unfocusedIcon: 'bar-chart-outline',
    component: AnalyticsScreen,
  },
  {
    key: 'settings',
    title: 'Settings',
    focusedIcon: 'settings',
    unfocusedIcon: 'settings-outline',
    component: SettingsScreen,
  },
];

const homeButsTop = [
  {
    title: 'Expense',
    subTitle: '',
    icon: 'arrow-up-bold-circle-outline',
    iconCol: 'red',
    iconStyle: '',
  },
  {
    title: 'Income',
    subTitle: '',
    icon: 'arrow-down-bold-circle-outline',
    iconCol: 'green',

    iconStyle: '',
  },
  {
    title: 'Investments',
    subTitle: '',
    icon: 'trending-up',
    iconCol: 'gold',
    iconStyle: '',
  },
  {
    title: 'Savings',
    subTitle: '',
    icon: 'piggy-bank-outline',
    iconCol: 'darkblue',
    iconStyle: '',
  },
];

// Initial categories
const expenseCategories = [
  'food',
  'transportation',
  'housing',
  'utilities',
  'entertainment',
  'shopping',
  'health',
  'education',
  'other',
];

const incomeCategories = [
  'salary',
  'freelance',
  'gifts',
  'dividends',
  'interest',
  'other',
];

const investmentCategories = [
  'stocks',
  'bonds',
  'crypto',
  'real-estate',
  'mutual-funds',
  'etf',
  'other',
];

const transferCategories = ['transfer', 'other'];

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export {
  navigations,
  homeButsTop,
  expenseCategories,
  incomeCategories,
  investmentCategories,
  transferCategories,months
};
