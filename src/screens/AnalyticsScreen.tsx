import {Text, View, Card, Chip} from 'react-native-ui-lib';
import React, {useState, useMemo} from 'react';
import tailwind from 'twrnc';
import {months} from '../constants';
import {BarChart, PieChart, LineChart} from 'react-native-gifted-charts';
import useStore from '../store';
import {
  getMonth,
  parseISO,
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subDays,
  isWithinInterval,
} from 'date-fns';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView, Dimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useTheme} from '../constants/themeContext';

interface Transaction {
  id: string;
  description: string;
  date: string;
  category: string;
  type: string;
  amount: number | string;
  tags?: string[];
}

const AnalyticsScreen = () => {
  const {transactionHistory} = useStore() as {
    transactionHistory: Transaction[];
  };
  const {theme, isDarkMode} = useTheme();
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'year'>(
    'month',
  );
  const screenWidth = Dimensions.get('window').width;

  // Filter transactions based on time period
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    let startDate: Date;
    let endDate: Date;

    switch (timeFilter) {
      case 'week':
        startDate = startOfWeek(now);
        endDate = endOfWeek(now);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31);
        break;
      default:
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
    }

    return transactionHistory.filter(txn => {
      const txnDate = parseISO(txn.date);
      return isWithinInterval(txnDate, {start: startDate, end: endDate});
    });
  }, [transactionHistory, timeFilter]);

  // Calculate totals
  const totals = useMemo(() => {
    const income = filteredTransactions
      .filter(txn => txn.type.toLowerCase() === 'income')
      .reduce((sum, txn) => sum + parseFloat(String(txn.amount)), 0);

    const expenses = filteredTransactions
      .filter(txn => txn.type.toLowerCase() === 'expense')
      .reduce((sum, txn) => sum + parseFloat(String(txn.amount)), 0);

    return {income, expenses};
  }, [filteredTransactions]);
  // Advanced analytics calculations
  const spendingTrends = useMemo(() => {
    const now = new Date();
    let currentPeriodStart: Date;
    let currentPeriodEnd: Date;
    let previousPeriodStart: Date;
    let previousPeriodEnd: Date;

    // Set the date ranges based on selected time filter
    switch (timeFilter) {
      case 'week':
        currentPeriodStart = startOfWeek(now);
        currentPeriodEnd = endOfWeek(now);
        previousPeriodStart = startOfWeek(subDays(currentPeriodStart, 7));
        previousPeriodEnd = endOfWeek(subDays(currentPeriodStart, 7));
        break;
      case 'year':
        currentPeriodStart = new Date(now.getFullYear(), 0, 1);
        currentPeriodEnd = new Date(now.getFullYear(), 11, 31);
        previousPeriodStart = new Date(now.getFullYear() - 1, 0, 1);
        previousPeriodEnd = new Date(now.getFullYear() - 1, 11, 31);
        break;
      default: // month
        currentPeriodStart = startOfMonth(now);
        currentPeriodEnd = endOfMonth(now);
        previousPeriodStart = startOfMonth(subDays(currentPeriodStart, 1));
        previousPeriodEnd = endOfMonth(previousPeriodStart);
    }

    // Filter transactions for the current period
    const currentPeriod = transactionHistory.filter(txn => {
      const txnDate = parseISO(txn.date);
      return isWithinInterval(txnDate, {
        start: currentPeriodStart,
        end: currentPeriodEnd,
      });
    });

    // Filter transactions for the previous period
    const previousPeriod = transactionHistory.filter(txn => {
      const txnDate = parseISO(txn.date);
      return isWithinInterval(txnDate, {
        start: previousPeriodStart,
        end: previousPeriodEnd,
      });
    });

    // Calculate expenses for current period
    const currentExpenses = currentPeriod
      .filter(txn => txn.type.toLowerCase() === 'expense')
      .reduce((sum, txn) => sum + parseFloat(String(txn.amount)), 0);

    // Calculate expenses for previous period
    const previousExpenses = previousPeriod
      .filter(txn => txn.type.toLowerCase() === 'expense')
      .reduce((sum, txn) => sum + parseFloat(String(txn.amount)), 0);

    // Calculate percentage change
    const percentageChange =
      previousExpenses === 0
        ? 0
        : ((currentExpenses - previousExpenses) / previousExpenses) * 100;

    return {
      current: currentExpenses,
      previous: previousExpenses,
      changePercent: percentageChange,
      isIncreasing: percentageChange > 0,
    };
  }, [transactionHistory, timeFilter]);

  // Top spending categories
  const topCategories = useMemo(() => {
    const categoryTotals: Record<string, number> = {};

    filteredTransactions
      .filter(txn => txn.type.toLowerCase() === 'expense')
      .forEach(txn => {
        const category = txn.category.toLowerCase();
        categoryTotals[category] =
          (categoryTotals[category] || 0) + parseFloat(String(txn.amount));
      });

    return Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([category, amount]) => ({
        category: category.charAt(0).toUpperCase() + category.slice(1),
        amount,
        percentage: (amount / totals.expenses) * 100,
      }));
  }, [filteredTransactions, totals.expenses]);

  // Financial health score
  const financialHealth = useMemo(() => {
    const savingsRate =
      totals.income > 0
        ? ((totals.income - totals.expenses) / totals.income) * 100
        : 0;
    let score = 0;
    let status: string;
    let color: string;

    if (savingsRate >= 20) {
      score = 90 + Math.min(savingsRate - 20, 10);
      status = 'Excellent';
      color = '#4CAF50';
    } else if (savingsRate >= 10) {
      score = 70 + (savingsRate - 10);
      status = 'Good';
      color = '#8BC34A';
    } else if (savingsRate >= 0) {
      score = 50 + savingsRate * 2;
      status = 'Fair';
      color = '#FF9800';
    } else {
      score = Math.max(0, 50 + savingsRate);
      status = 'Poor';
      color = '#FF5252';
    }

    return {score: Math.round(score), status, color, savingsRate};
  }, [totals.income, totals.expenses]);
  // Generate chart data
  const chartData = useMemo(() => {
    const data = [];
    const now = new Date();
    const periodCount =
      timeFilter === 'year' ? 12 : timeFilter === 'month' ? 30 : 7;

    for (let i = 0; i < periodCount; i++) {
      let startDate: Date;
      let endDate: Date;

      // Get proper label and date range based on time filter
      const period =
        timeFilter === 'year'
          ? months[i] // Month name
          : timeFilter === 'month'
          ? `Day ${i + 1}` // Day number in month
          : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i]; // Day name in week

      // Set the correct date range for each period
      if (timeFilter === 'year') {
        // For year view: each month of current year
        startDate = new Date(now.getFullYear(), i, 1);
        endDate = new Date(now.getFullYear(), i + 1, 0); // Last day of month
      } else if (timeFilter === 'month') {
        // For month view: each day of current month
        const currentMonthStart = startOfMonth(now);
        startDate = new Date(currentMonthStart);
        startDate.setDate(i + 1);
        endDate = new Date(startDate);
        endDate.setHours(23, 59, 59, 999);
      } else {
        // For week view: each day of current week
        const weekStart = startOfWeek(now);
        startDate = new Date(weekStart);
        startDate.setDate(weekStart.getDate() + i);
        endDate = new Date(startDate);
        endDate.setHours(23, 59, 59, 999);
      }

      // Filter income transactions for this period
      const incomeValue = filteredTransactions
        .filter(txn => {
          const txnDate = parseISO(txn.date);
          return (
            isWithinInterval(txnDate, {start: startDate, end: endDate}) &&
            txn.type.toLowerCase() === 'income'
          );
        })
        .reduce((sum, txn) => sum + parseFloat(String(txn.amount)), 0);

      // Filter expense transactions for this period
      const expenseValue = filteredTransactions
        .filter(txn => {
          const txnDate = parseISO(txn.date);
          return (
            isWithinInterval(txnDate, {start: startDate, end: endDate}) &&
            txn.type.toLowerCase() === 'expense'
          );
        })
        .reduce((sum, txn) => sum + parseFloat(String(txn.amount)), 0);

      data.push({
        label: period,
        value: incomeValue,
        frontColor: '#4CAF50',
        spacing: 2,
        labelWidth: 60,
      });

      data.push({
        value: expenseValue,
        frontColor: '#FF5252',
      });
    }
    return data;
  }, [filteredTransactions, timeFilter]);

  // Generate pie chart data for expenses
  const expensePieData = useMemo(() => {
    const categoryTotals: Record<string, number> = {};

    filteredTransactions
      .filter(txn => txn.type.toLowerCase() === 'expense')
      .forEach(txn => {
        const category = txn.category.toLowerCase();
        categoryTotals[category] =
          (categoryTotals[category] || 0) + parseFloat(String(txn.amount));
      });

    const colors = [
      '#FF5252',
      '#FF4081',
      '#E91E63',
      '#9C27B0',
      '#673AB7',
      '#3F51B5',
      '#2196F3',
      '#03A9F4',
      '#00BCD4',
      '#009688',
      '#4CAF50',
      '#8BC34A',
    ];

    return Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)
      .map(([category, amount], index) => ({
        value: amount,
        text: category.charAt(0).toUpperCase() + category.slice(1),
        color: colors[index % colors.length],
      }));
  }, [filteredTransactions]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };
  const CenterLabelComponent = () => (
    <View style={tailwind`items-center`}>
      <Text style={[tailwind`text-lg font-bold`, {color: theme.text}]}>
        {formatCurrency(totals.expenses)}
      </Text>
      <Text style={[tailwind`text-xs`, {color: theme.textSecondary}]}>
        Total
      </Text>
    </View>
  );
  return (
    <SafeAreaView
      style={[tailwind`flex-1`, {backgroundColor: theme.backgroundSecondary}]}
      edges={['top']}>
      <View style={tailwind`flex-1`}>
        {/* Header with gradient */}
        <LinearGradient
          colors={
            isDarkMode
              ? [theme.headerBackground, '#1f2937']
              : ['#667eea', '#764ba2']
          }
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={tailwind`p-4 pb-6 z-10 shadow-lg`}>
          <Text style={[tailwind`text-2xl font-bold mb-2`, {color: '#FFFFFF'}]}>
            Analytics Dashboard
          </Text>
          <Text style={[tailwind`text-sm opacity-90`, {color: '#FFFFFF'}]}>
            Your financial insights at a glance
          </Text>
        </LinearGradient>

        <ScrollView
          style={tailwind`flex-1 z-0 -mt-2`}
          contentContainerStyle={tailwind`pt-2`}
          showsVerticalScrollIndicator={false}>
          {/* Time Filter Chips */}
          <View
            style={[
              tailwind`flex-row px-4 py-3`,
              {backgroundColor: theme.cardBackground},
            ]}>
            {(['week', 'month', 'year'] as const).map(period => (
              <Chip
                key={period}
                label={period.charAt(0).toUpperCase() + period.slice(1)}
                containerStyle={[
                  tailwind`mr-3 px-4 py-2 rounded-full`,
                  timeFilter === period
                    ? {backgroundColor: theme.primary}
                    : {backgroundColor: theme.backgroundSecondary},
                ]}
                labelStyle={[
                  tailwind`text-sm font-medium`,
                  {color: timeFilter === period ? '#FFFFFF' : theme.text},
                ]}
                onPress={() => setTimeFilter(period)}
              />
            ))}
          </View>
          {filteredTransactions.length > 0 ? (
            <>
              {/* Summary Cards */}
              <View style={tailwind`flex-row px-4 py-3`}>
                <Card
                  style={[
                    tailwind`flex-1 mr-2 p-4 border rounded-xl`,
                    {
                      backgroundColor: isDarkMode
                        ? theme.cardBackground
                        : '#f0fdf4',
                      borderColor: theme.incomeColor + '40',
                    },
                  ]}>
                  <Text
                    style={[
                      tailwind`text-xs font-semibold mb-1`,
                      {color: theme.incomeColor},
                    ]}>
                    INCOME
                  </Text>
                  <Text
                    style={[
                      tailwind`text-lg font-bold`,
                      {color: theme.incomeColor},
                    ]}>
                    {formatCurrency(totals.income)}
                  </Text>
                </Card>

                <Card
                  style={[
                    tailwind`flex-1 ml-2 p-4 border rounded-xl`,
                    {
                      backgroundColor: isDarkMode
                        ? theme.cardBackground
                        : '#fef2f2',
                      borderColor: theme.expenseColor + '40',
                    },
                  ]}>
                  <Text
                    style={[
                      tailwind`text-xs font-semibold mb-1`,
                      {color: theme.expenseColor},
                    ]}>
                    EXPENSES
                  </Text>
                  <Text
                    style={[
                      tailwind`text-lg font-bold`,
                      {color: theme.expenseColor},
                    ]}>
                    {formatCurrency(totals.expenses)}
                  </Text>
                </Card>
              </View>
              {/* Financial Health Score */}
              <Card
                style={[
                  tailwind`mx-4 my-3 p-4 rounded-xl shadow-sm`,
                  {backgroundColor: theme.cardBackground},
                ]}>
                <Text
                  style={[
                    tailwind`text-lg font-bold mb-4`,
                    {color: theme.text},
                  ]}>
                  Financial Health Score
                </Text>
                <View style={tailwind`items-center mb-4`}>
                  <View
                    style={tailwind`relative w-32 h-32 items-center justify-center`}>
                    <View
                      style={[
                        tailwind`absolute w-32 h-32 rounded-full border-8`,
                        {borderColor: '#E5E7EB'},
                      ]}
                    />
                    <View
                      style={[
                        tailwind`absolute w-32 h-32 rounded-full border-8`,
                        {
                          borderColor: financialHealth.color,
                          transform: [
                            {
                              rotate: `${
                                (financialHealth.score / 100) * 360
                              }deg`,
                            },
                          ],
                          borderTopColor: 'transparent',
                          borderRightColor: 'transparent',
                          borderBottomColor: 'transparent',
                        },
                      ]}
                    />
                    <View style={tailwind`items-center`}>
                      <Text
                        style={[
                          tailwind`text-2xl font-bold`,
                          {color: theme.text},
                        ]}>
                        {financialHealth.score}
                      </Text>
                      <Text
                        style={[
                          tailwind`text-xs`,
                          {color: theme.textSecondary},
                        ]}>
                        SCORE
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={[
                      tailwind`text-lg font-semibold mt-2`,
                      {color: financialHealth.color},
                    ]}>
                    {financialHealth.status}
                  </Text>
                  <Text
                    style={[
                      tailwind`text-sm text-center mt-1`,
                      {color: theme.textSecondary},
                    ]}>
                    Savings Rate: {financialHealth.savingsRate.toFixed(1)}%
                  </Text>
                </View>
              </Card>
              {/* Income vs Expenses Chart */}
              <Card
                style={[
                  tailwind`mx-4 my-3 p-4 rounded-xl shadow-sm`,
                  {backgroundColor: theme.cardBackground},
                ]}>
                <Text
                  style={[
                    tailwind`text-lg font-bold mb-4`,
                    {color: theme.text},
                  ]}>
                  Income vs Expenses
                </Text>
                <BarChart
                  data={chartData}
                  width={screenWidth - 80}
                  height={200}
                  barBorderRadius={4}
                  noOfSections={4}
                  spacing={24}
                  backgroundColor={'transparent'}
                />
                <View style={tailwind`flex-row justify-center mt-4`}>
                  <View style={tailwind`flex-row items-center mr-6`}>
                    <View
                      style={tailwind`w-3 h-3 bg-green-500 rounded-full mr-2`}
                    />
                    <Text
                      style={[tailwind`text-sm`, {color: theme.textSecondary}]}>
                      Income
                    </Text>
                  </View>
                  <View style={tailwind`flex-row items-center`}>
                    <View
                      style={tailwind`w-3 h-3 bg-red-500 rounded-full mr-2`}
                    />
                    <Text
                      style={[tailwind`text-sm`, {color: theme.textSecondary}]}>
                      Expenses
                    </Text>
                  </View>
                </View>
              </Card>
              {/* Expense Categories Pie Chart */}
              {expensePieData.length > 0 && (
                <Card
                  style={[
                    tailwind`mx-4 my-3 p-4 rounded-xl shadow-sm`,
                    {backgroundColor: theme.cardBackground},
                  ]}>
                  <Text
                    style={[
                      tailwind`text-lg font-bold mb-4`,
                      {color: theme.text},
                    ]}>
                    Expense Categories
                  </Text>
                  <View style={tailwind`items-center`}>
                    <PieChart
                      data={expensePieData}
                      radius={100}
                      donut
                      innerRadius={60}
                      centerLabelComponent={CenterLabelComponent}
                    />
                  </View>
                  <View
                    style={tailwind`flex-row flex-wrap justify-center mt-4`}>
                    {expensePieData.map(item => (
                      <View
                        key={item.text}
                        style={tailwind`flex-row items-center m-2`}>
                        <View
                          style={[
                            tailwind`w-2.5 h-2.5 rounded-full mr-2`,
                            {backgroundColor: item.color},
                          ]}
                        />
                        <Text
                          style={[
                            tailwind`text-xs`,
                            {color: theme.textSecondary},
                          ]}>
                          {item.text}
                        </Text>
                      </View>
                    ))}
                  </View>
                </Card>
              )}
              {/* Spending Trends */}
              <Card
                style={[
                  tailwind`mx-4 my-3 p-4 rounded-xl shadow-sm`,
                  {backgroundColor: theme.cardBackground},
                ]}>
                <Text
                  style={[
                    tailwind`text-lg font-bold mb-4`,
                    {color: theme.text},
                  ]}>
                  Spending Trends
                </Text>
                <View
                  style={tailwind`flex-row items-center justify-between mb-3`}>
                  <View>
                    <Text
                      style={[tailwind`text-sm`, {color: theme.textSecondary}]}>
                      This Period
                    </Text>
                    <Text
                      style={[
                        tailwind`text-xl font-bold`,
                        {color: theme.text},
                      ]}>
                      {formatCurrency(spendingTrends.current)}
                    </Text>
                  </View>
                  <View style={tailwind`items-end`}>
                    <Text
                      style={[tailwind`text-sm`, {color: theme.textSecondary}]}>
                      vs Last Period
                    </Text>
                    <View style={tailwind`flex-row items-center`}>
                      <Text
                        style={[
                          tailwind`text-lg font-bold`,
                          {
                            color: spendingTrends.isIncreasing
                              ? '#FF5252'
                              : '#4CAF50',
                          },
                        ]}>
                        {spendingTrends.isIncreasing ? '↑' : '↓'}{' '}
                        {Math.abs(spendingTrends.changePercent).toFixed(1)}%
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={[
                    tailwind`rounded-lg p-3`,
                    {backgroundColor: theme.backgroundSecondary},
                  ]}>
                  <Text
                    style={[
                      tailwind`text-xs mb-1`,
                      {color: theme.textSecondary},
                    ]}>
                    Previous Period
                  </Text>
                  <Text
                    style={[
                      tailwind`text-lg font-semibold`,
                      {color: theme.text},
                    ]}>
                    {formatCurrency(spendingTrends.previous)}
                  </Text>
                </View>
              </Card>
              {/* Top Spending Categories */}
              <Card
                style={[
                  tailwind`mx-4 my-3 p-4 rounded-xl shadow-sm`,
                  {backgroundColor: theme.cardBackground},
                ]}>
                <Text
                  style={[
                    tailwind`text-lg font-bold mb-4`,
                    {color: theme.text},
                  ]}>
                  Top Spending Categories
                </Text>
                {topCategories.map(category => (
                  <View key={category.category} style={tailwind`mb-3`}>
                    <View
                      style={tailwind`flex-row justify-between items-center mb-1`}>
                      <Text
                        style={[tailwind`font-medium`, {color: theme.text}]}>
                        {category.category}
                      </Text>
                      <Text style={[tailwind`font-bold`, {color: theme.text}]}>
                        {formatCurrency(category.amount)}
                      </Text>
                    </View>
                    <View
                      style={[
                        tailwind`rounded-full h-2`,
                        {backgroundColor: theme.backgroundSecondary},
                      ]}>
                      <View
                        style={[
                          tailwind`h-2 rounded-full`,
                          {
                            width: `${category.percentage}%`,
                            backgroundColor: theme.primary,
                          },
                        ]}
                      />
                    </View>
                    <Text
                      style={[
                        tailwind`text-xs mt-1`,
                        {color: theme.textSecondary},
                      ]}>
                      {category.percentage.toFixed(1)}% of total expenses
                    </Text>
                  </View>
                ))}
              </Card>
              {/* Monthly Comparison Chart */}
              <Card
                style={[
                  tailwind`mx-4 my-3 p-4 rounded-xl shadow-sm`,
                  {backgroundColor: theme.cardBackground},
                ]}>
                <Text
                  style={[
                    tailwind`text-lg font-bold mb-4`,
                    {color: theme.text},
                  ]}>
                  6-Month Expense Trend
                </Text>
                <LineChart
                  data={(() => {
                    const monthlyData = [];
                    for (let i = 5; i >= 0; i--) {
                      const monthStart = startOfMonth(
                        subDays(new Date(), i * 30),
                      );
                      const monthEnd = endOfMonth(subDays(new Date(), i * 30));

                      const monthExpenses = transactionHistory
                        .filter(txn => {
                          const txnDate = parseISO(txn.date);
                          return (
                            isWithinInterval(txnDate, {
                              start: monthStart,
                              end: monthEnd,
                            }) && txn.type.toLowerCase() === 'expense'
                          );
                        })
                        .reduce(
                          (sum, txn) => sum + parseFloat(String(txn.amount)),
                          0,
                        );

                      monthlyData.push({
                        value: monthExpenses,
                        label: format(monthStart, 'MMM'),
                      });
                    }
                    return monthlyData;
                  })()}
                  width={screenWidth - 80}
                  height={180}
                  curved
                  color={'#FF5252'}
                  thickness={3}
                  dataPointsColor={'#FF5252'}
                  dataPointsRadius={6}
                  yAxisThickness={1}
                  xAxisThickness={1}
                  yAxisColor={'#E5E7EB'}
                  xAxisColor={'#E5E7EB'}
                  yAxisTextStyle={[
                    tailwind`text-xs`,
                    {color: theme.textSecondary},
                  ]}
                  xAxisLabelTextStyle={[
                    tailwind`text-xs`,
                    {color: theme.textSecondary},
                  ]}
                  backgroundColor="transparent"
                  areaChart
                  startFillColor={'rgba(255, 82, 82, 0.1)'}
                  endFillColor={'rgba(255, 82, 82, 0.05)'}
                />
              </Card>
            </>
          ) : (
            <View style={tailwind`flex-1 justify-center items-center py-20`}>
              <Text
                style={[
                  tailwind`text-xl font-semibold mb-2`,
                  {color: theme.textSecondary},
                ]}>
                No Transactions Found
              </Text>
              <Text
                style={[
                  tailwind`text-sm text-center px-8`,
                  {color: theme.textSecondary},
                ]}>
                Add some transactions to see your financial analytics and
                insights here.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default AnalyticsScreen;
