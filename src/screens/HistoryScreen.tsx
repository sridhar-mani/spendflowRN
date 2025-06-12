import React, {useState, useEffect} from 'react';
import {View, FlatList, TouchableOpacity, Alert} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  Card,
  Text,
  IconButton,
  Chip,
  Divider,
  Searchbar,
  Button,
  Menu,
} from 'react-native-paper';
import {format} from 'date-fns';
import tw from 'twrnc';
import useStore from '../store/index';
import TransactionItem from '../component/TransactionItem';
import TransactionModal from '../component/TransactionModel';

const HistoryScreen = () => {
  const {transactionHistory, deleteTransaction} = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showModel, setShowmodal] = useState(false);
  const [editingTxnId, setEditingTxnId] = useState(null);

  // Load transactions initially and when history changes
  useEffect(() => {
    filterTransactions(searchQuery, activeFilter);
  }, [transactionHistory, searchQuery, activeFilter]);

  // Filter transactions based on search and type filter
  const filterTransactions = (query, filter) => {
    let filtered = [...(transactionHistory || [])];

    // Apply type filter
    if (filter !== 'all') {
      filtered = filtered.filter(t => t.type === filter);
    }

    // Apply search query
    if (query) {
      const lowercaseQuery = query.toLowerCase();
      filtered = filtered.filter(
        t =>
          t.description.toLowerCase().includes(lowercaseQuery) ||
          t.category.toLowerCase().includes(lowercaseQuery) ||
          (t.tags &&
            t.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))),
      );
    }

    setFilteredTransactions(filtered);
  };

  // Handle delete transaction
  const handleDeleteTransaction = id => {
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
  const calculateTotal = transactions => {
    return transactions.reduce((total, t) => {
      const amount =
        typeof t.amount === 'string' ? parseFloat(t.amount) : t.amount;
      return total + (isNaN(amount) ? 0 : amount);
    }, 0);
  };

  const total = calculateTotal(filteredTransactions);
  const incomeTotal = calculateTotal(
    filteredTransactions.filter(t => t.type === 'income'),
  );
  const expenseTotal = calculateTotal(
    filteredTransactions.filter(t => t.type === 'expense'),
  );
  const investmentTotal = calculateTotal(
    filteredTransactions.filter(t => t.type === 'invest'),
  );

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`} edges={['top']}>
      <View style={tw`flex-1`}>
        <View style={tw`p-4 bg-white border-b border-gray-200`}>
          <Text style={tw`text-2xl font-bold mb-2`}>Transaction History</Text>

          {/* Search bar */}
          <Searchbar
            placeholder="Search transactions"
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={tw`mb-3 rounded-lg`}
          />

          {/* Filter buttons */}
          <View style={tw`flex-row justify-between mb-3`}>
            <Button
              mode={activeFilter === 'all' ? 'contained' : 'outlined'}
              onPress={() => setActiveFilter('all')}
              style={tw`rounded-full mr-1`}>
              All
            </Button>
            <Button
              mode={activeFilter === 'expense' ? 'contained' : 'outlined'}
              onPress={() => setActiveFilter('expense')}
              buttonColor={
                activeFilter === 'expense' ? 'rgb(239 68 68)' : 'white'
              }
              textColor={
                activeFilter === 'expense' ? 'white' : 'rgb(239 68 68)'
              }
              style={tw`rounded-full mr-1`}>
              Expenses
            </Button>
            <Button
              mode={activeFilter === 'income' ? 'contained' : 'outlined'}
              onPress={() => setActiveFilter('income')}
              buttonColor={
                activeFilter === 'income' ? 'rgb(34 197 94)' : 'white'
              }
              textColor={activeFilter === 'income' ? 'white' : 'rgb(34 197 94)'}
              style={tw`rounded-full mr-1`}>
              Income
            </Button>
            <Button
              mode={activeFilter === 'invest' ? 'contained' : 'outlined'}
              onPress={() => setActiveFilter('invest')}
              buttonColor={
                activeFilter === 'invest' ? 'rgb(234 179 8)' : 'white'
              }
              textColor={activeFilter === 'invest' ? 'white' : 'rgb(234 179 8)'}
              style={tw`rounded-full`}>
              Invest
            </Button>
          </View>

          {/* Summary cards */}
          <View style={tw`flex-row gap-3 justify-between `}>
            {(activeFilter === 'all' || activeFilter === 'income') && (
              <Card style={tw`flex-1 `}>
                <Card.Content>
                  <Text style={tw`text-xs mb-1 text-gray-500`}>Income</Text>
                  <Text style={tw`text-lg font-bold text-green-600`}>
                    ₹{incomeTotal.toFixed(2)}
                  </Text>
                </Card.Content>
              </Card>
            )}
            {(activeFilter === 'all' || activeFilter === 'expense') && (
              <Card style={tw`flex-1`}>
                <Card.Content>
                  <Text style={tw`text-xs mb-1 text-gray-500`}>Expenses</Text>
                  <Text style={tw`text-lg font-bold text-red-600`}>
                    ₹{expenseTotal.toFixed(2)}
                  </Text>
                </Card.Content>
              </Card>
            )}
            {activeFilter === 'invest' && (
              <Card style={tw`flex-1`}>
                <Card.Content>
                  <Text style={tw`text-xs mb-1 text-gray-500`}>
                    Investments
                  </Text>
                  <Text style={tw`text-lg font-bold text-amber-600`}>
                    ₹{investmentTotal.toFixed(2)}
                  </Text>
                </Card.Content>
              </Card>
            )}
          </View>
        </View>

        {/* Transaction list - Now takes remaining space */}
        <FlatList
          data={filteredTransactions}
          keyExtractor={item => item.id}
          style={tw`flex-1`}
          renderItem={({item}) => (
            <View>
              <TransactionItem
                item={item}
                onEdit={() => {
                  setEditingTxnId(item.id);
                  setShowmodal(!showModel);
                }}
                onDelete={handleDeleteTransaction}
              />
            </View>
          )}
          contentContainerStyle={
            filteredTransactions.length === 0
              ? tw`flex-1 justify-center`
              : tw`p-3 pb-20`
          }
          ListEmptyComponent={() => (
            <View style={tw`items-center justify-center`}>
              <Text style={tw`text-gray-500`}>No transactions found</Text>
            </View>
          )}
        />

        {showModel && (
          <TransactionModal
            txnId={editingTxnId}
            visible={showModel}
            hideDialog={() => {
              setShowmodal(false);
              setEditingTxnId(null);
            }}
            onSubmitTransaction={() => {
              setShowmodal(false);
              setEditingTxnId(null);
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default HistoryScreen;
