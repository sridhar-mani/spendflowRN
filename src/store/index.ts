import {create} from 'zustand';
import {
  expenseCategories,
  incomeCategories,
  investmentCategories,
  transferCategories,
} from '../constants';
import {persist, createJSONStorage} from 'zustand/middleware';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {transactionTypes} from '../constants/transactionTypes';


// Create store with persistence
const useStore = create(
  persist(
    (set, get) => ({
      // Transaction data
      transaction: {
        type: transactionTypes.EXPENSE,
        description: '',
        amount: '',
        date: new Date(),
        category: '',
        tags: [],
        accountName: '',
      },

      // Transaction history
      transactionHistory: [],

      // Categories storage
      categories: {
        expense: expenseCategories,
        income: incomeCategories,
        investment: investmentCategories,
        transfer: transferCategories,
      },

      settings: {
        savings: 0,
        invests: 0,
        savingsGoal: 0,
      },
      setSettings: settings => set({settings}),

      // All transaction tags
      tags: [],

      // Available transaction types
      transactionTypes: transactionTypes,

      // Update entire transaction
      setTransaction: transaction => set({transaction}),

      // Update a specific field in the transaction
      updateTransaction: (field, value) =>
        set(state => ({
          transaction: {
            ...state.transaction,
            [field]: value,
          },
        })),

      // Reset transaction to default values
      resetTransaction: () =>
        set(state => ({
          transaction: {
            type: transactionTypes.EXPENSE,
            description: '',
            amount: '',
            date: new Date(),
            category: '',
            tags: [],
            accountName: '',
          },
        })),

      // Add transaction to history
      addTransactionToHistory: transaction =>
        set(state => ({
          transactionHistory: [
            {
              ...transaction,
              id: Date.now().toString(), // Create a unique ID
              createdAt: new Date().toISOString(),
            },
            ...state.transactionHistory,
          ],
        })),

      // Delete transaction from history
      deleteTransaction: id =>
        set(state => ({
          transactionHistory: state.transactionHistory.filter(t => t.id !== id),
        })),

      // Edit transaction in history
      editTransaction: (id, updatedTransaction) =>
        set(state => ({
          transactionHistory: state.transactionHistory.map(t =>
            t.id === id
              ? {
                  ...t,
                  ...updatedTransaction,
                  updatedAt: new Date().toISOString(),
                }
              : t,
          ),
        })),

      // Filter transactions by type
      getTransactionsByType: type => {
        return get().transactionHistory.filter(t => t.type === type);
      },

      // Filter transactions by category
      getTransactionsByCategory: category => {
        return get().transactionHistory.filter(t => t.category === category);
      },

      // Filter transactions by date range
      getTransactionsByDateRange: (startDate, endDate) => {
        return get().transactionHistory.filter(t => {
          const transactionDate = new Date(t.date);
          return transactionDate >= startDate && transactionDate <= endDate;
        });
      },

      // Calculate total amount for specified transactions
      calculateTotal: transactions => {
        return transactions.reduce((total, t) => {
          const amount =
            typeof t.amount === 'string' ? parseFloat(t.amount) : t.amount;
          return total + amount;
        }, 0);
      },

      // Add a new category to a specific transaction type
      addCategory: (type, category) =>
        set(state => {
          // Check if category already exists
          if (state.categories[type].includes(category)) {
            return state;
          }

          return {
            categories: {
              ...state.categories,
              [type]: [...state.categories[type], category],
            },
          };
        }),

      // Add a new tag to global tags
      addTag: tag =>
        set(state => {
          // Check if tag already exists
          if (state.tags.includes(tag)) {
            return state;
          }

          return {
            tags: [...state.tags, tag],
          };
        }),

      // Add a tag to current transaction
      addTagToTransaction: tag =>
        set(state => {
          // Check if tag already exists in transaction
          if (state.transaction.tags.includes(tag)) {
            return state;
          }

          return {
            transaction: {
              ...state.transaction,
              tags: [...state.transaction.tags, tag],
            },
          };
        }),

      // Remove a tag from current transaction
      removeTagFromTransaction: tag =>
        set(state => ({
          transaction: {
            ...state.transaction,
            tags: state.transaction.tags.filter(t => t !== tag),
          },
        })),

      // Get categories for a specific transaction type
      getCategoriesForType: type => {
        return get().categories[type] || [];
      },
    }),
    {
      name: 'transaction-storage', // name of the item in the storage
      storage: createJSONStorage(() => AsyncStorage), // use AsyncStorage for persistence
    },
  ),
);

export default useStore;
