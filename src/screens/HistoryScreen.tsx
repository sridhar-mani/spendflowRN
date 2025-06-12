import React, {useState, useEffect} from 'react';
import {FlatList, Alert} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  View,
  Text,
  Card,
  Colors,
  TouchableOpacity,
  TextField,
} from 'react-native-ui-lib';
import tailwind from 'twrnc';
import useStore from '../store/index';
import TransactionItem from '../component/TransactionItem';
import TransactionModal from '../component/TransactionModel';
import {useTheme} from '../constants/themeContext';

interface Transaction {
  id: string;
  type: string;
  amount: number | string;
  description: string;
  category: string;
  tags?: string[];
  date: string;
}

const EmptyComponent = () => {
  const {theme} = useTheme();
  return (
    <View style={tailwind`items-center justify-center flex-1 py-20`}>
      <Text
        text70
        style={[tailwind`text-center`, {color: theme.textSecondary}]}>
        No transactions found
      </Text>
      <Text
        text80
        style={[tailwind`mt-2 text-center`, {color: theme.textSecondary}]}>
        Try adjusting your search or filter
      </Text>
    </View>
  );
};

const HistoryScreen = () => {
  const {transactionHistory, deleteTransaction} = useStore() as any;
  const {theme, isDarkMode} = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingTxnId, setEditingTxnId] = useState<string | null>(null);

  // Filter transactions based on search and type filter
  const filterTransactions = React.useCallback(
    (query: string, filter: string) => {
      let filtered = [...(transactionHistory ?? [])];

      // Apply type filter
      if (filter !== 'all') {
        filtered = filtered.filter((t: Transaction) => t.type === filter);
      }

      // Apply search query
      if (query) {
        const lowercaseQuery = query.toLowerCase();
        filtered = filtered.filter(
          (t: Transaction) =>
            t.description.toLowerCase().includes(lowercaseQuery) ||
            t.category.toLowerCase().includes(lowercaseQuery) ||
            t.tags?.some((tag: string) =>
              tag.toLowerCase().includes(lowercaseQuery),
            ),
        );
      }

      setFilteredTransactions(filtered);
    },
    [transactionHistory],
  );

  // Load transactions initially and when history changes
  useEffect(() => {
    filterTransactions(searchQuery, activeFilter);
  }, [filterTransactions, searchQuery, activeFilter]);

  // Handle delete transaction
  const handleDeleteTransaction = (id: string) => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          onPress: () => deleteTransaction(id),
          style: 'destructive',
        },
      ],
    );
  };

  // Calculate totals directly in the component
  const calculateTotal = (transactions: Transaction[]) => {
    return transactions.reduce((total: number, t: Transaction) => {
      const amount =
        typeof t.amount === 'string' ? parseFloat(t.amount) : t.amount;
      return total + (isNaN(amount) ? 0 : amount);
    }, 0);
  };

  const incomeTotal = calculateTotal(
    filteredTransactions.filter((t: Transaction) => t.type === 'income'),
  );
  const expenseTotal = calculateTotal(
    filteredTransactions.filter((t: Transaction) => t.type === 'expense'),
  );
  const investmentTotal = calculateTotal(
    filteredTransactions.filter((t: Transaction) => t.type === 'invest'),
  );
  // Filter button styles
  const getFilterButtonStyle = (filterType: string) => {
    if (activeFilter === filterType) {
      switch (filterType) {
        case 'all':
          return {backgroundColor: theme.primary};
        case 'expense':
          return {backgroundColor: theme.expenseColor};
        case 'income':
          return {backgroundColor: theme.incomeColor};
        case 'invest':
          return {backgroundColor: theme.investmentColor};
        default:
          return {backgroundColor: theme.backgroundSecondary};
      }
    }
    return {backgroundColor: theme.backgroundSecondary};
  };
  return (
    <SafeAreaView
      style={[tailwind`flex-1`, {backgroundColor: theme.backgroundSecondary}]}>
      <View style={tailwind`flex-1`}>
        {/* Modern Header with Search */}
        <View
          style={[
            tailwind`px-6 pt-4 pb-6 shadow-sm`,
            {backgroundColor: theme.cardBackground},
          ]}>
          <Text text40 style={[tailwind`mb-6 font-bold`, {color: theme.text}]}>
            Transaction History
          </Text>
          {/* Enhanced Search bar with icon */}
          <View style={tailwind`relative mb-4`}>
            <View
              style={[
                tailwind`absolute left-4 top-1/2 z-10`,
                {transform: [{translateY: -10}]},
              ]}>
              <Text style={tailwind`text-lg`}>🔍</Text>
            </View>
            <TextField
              placeholder="Search transactions..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              fieldStyle={[
                tailwind`rounded-2xl pl-12 pr-4 py-4 border-0`,
                {backgroundColor: theme.backgroundSecondary, color: theme.text},
              ]}
              placeholderTextColor={theme.textSecondary}
            />
          </View>
          {/* Filter chips as TouchableOpacity buttons */}
          <View style={tailwind`flex-row flex-wrap gap-2 mb-4`}>
            <TouchableOpacity
              onPress={() => setActiveFilter('all')}
              style={[
                tailwind`px-4 py-2 rounded-full`,
                getFilterButtonStyle('all'),
              ]}>
              <Text
                text80
                style={[
                  tailwind`font-medium`,
                  {color: activeFilter === 'all' ? '#FFFFFF' : theme.text},
                ]}>
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveFilter('expense')}
              style={[
                tailwind`px-4 py-2 rounded-full`,
                getFilterButtonStyle('expense'),
              ]}>
              <Text
                text80
                style={[
                  tailwind`font-medium`,
                  {color: activeFilter === 'expense' ? '#FFFFFF' : theme.text},
                ]}>
                Expenses
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveFilter('income')}
              style={[
                tailwind`px-4 py-2 rounded-full`,
                getFilterButtonStyle('income'),
              ]}>
              <Text
                text80
                style={[
                  tailwind`font-medium`,
                  {color: activeFilter === 'income' ? '#FFFFFF' : theme.text},
                ]}>
                Income
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveFilter('invest')}
              style={[
                tailwind`px-4 py-2 rounded-full`,
                getFilterButtonStyle('invest'),
              ]}>
              <Text
                text80
                style={[
                  tailwind`font-medium`,
                  {color: activeFilter === 'invest' ? '#FFFFFF' : theme.text},
                ]}>
                Investments
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Summary cards */}
        <View style={tailwind`px-6 pb-4`}>
          <View style={tailwind`flex-row gap-3`}>
            {(activeFilter === 'all' || activeFilter === 'income') && (
              <Card
                style={tailwind`flex-1 p-4 rounded-2xl`}
                backgroundColor="#e8f5e8">
                <Text text80 color="#2e7d32" style={tailwind`font-medium`}>
                  💰 Income
                </Text>
                <Text text60 color="#2e7d32" style={tailwind`font-bold mt-1`}>
                  ₹{' '}
                  {incomeTotal.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Text>
              </Card>
            )}
            {(activeFilter === 'all' || activeFilter === 'expense') && (
              <Card
                style={tailwind`flex-1 p-4 rounded-2xl`}
                backgroundColor="#ffebee">
                <Text text80 color="#c62828" style={tailwind`font-medium`}>
                  💸 Expenses
                </Text>
                <Text text60 color="#c62828" style={tailwind`font-bold mt-1`}>
                  ₹{' '}
                  {expenseTotal.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Text>
              </Card>
            )}
            {(activeFilter === 'all' || activeFilter === 'invest') && (
              <Card
                style={tailwind`flex-1 p-4 rounded-2xl`}
                backgroundColor="#fff3e0">
                <Text text80 color="#f57c00" style={tailwind`font-medium`}>
                  📈 Investments
                </Text>
                <Text text60 color="#f57c00" style={tailwind`font-bold mt-1`}>
                  ₹{' '}
                  {investmentTotal.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Text>
              </Card>
            )}
          </View>
        </View>
        {/* Transaction list */}
        <FlatList
          data={filteredTransactions}
          keyExtractor={(item: Transaction) => item.id}
          style={tailwind`flex-1`}
          renderItem={({item}) => (
            <TransactionItem
              item={item}
              onEdit={() => {
                setEditingTxnId(item.id);
                setShowModal(true);
              }}
              onDelete={() => handleDeleteTransaction(item.id)}
            />
          )}
          contentContainerStyle={
            filteredTransactions.length === 0
              ? tailwind`flex-1`
              : tailwind`p-3 pb-20`
          }
          ListEmptyComponent={EmptyComponent}
        />
        {showModal && (
          <TransactionModal
            txnId={editingTxnId}
            visible={showModal}
            hideDialog={() => {
              setShowModal(false);
              setEditingTxnId(null);
            }}
            onSubmitTransaction={() => {
              setShowModal(false);
              setEditingTxnId(null);
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default HistoryScreen;
