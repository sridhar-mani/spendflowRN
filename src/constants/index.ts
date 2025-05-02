import React from 'react';

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

export {
  homeButsTop,
  expenseCategories,
  incomeCategories,
  investmentCategories,
  transferCategories,
  months,
};
