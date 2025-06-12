import {Colors} from 'react-native-ui-lib';

// Helper function to get color based on transaction type with dark mode support
export const getTransactionColor = (type: string, isDarkMode: boolean = false) => {
  switch (type) {
    case 'expense':
      return isDarkMode ? Colors.red20 : Colors.red30;
    case 'income':
      return isDarkMode ? Colors.green20 : Colors.green30;
    case 'investment':
    case 'invest':
      return isDarkMode ? Colors.yellow20 : Colors.yellow30;
    case 'savings':
      return isDarkMode ? Colors.blue20 : Colors.blue30;
    case 'transfer':
      return isDarkMode ? Colors.purple20 : Colors.blue30;
    default:
      return isDarkMode ? Colors.grey20 : Colors.grey30;
  }
};

// Helper function to get category icon emoji
export const getCategoryIcon = (category: string, type: string) => {
  switch (category.toLowerCase()) {
    case 'food':
      return '🍕';
    case 'transportation':
    case 'transport':
      return '🚗';
    case 'shopping':
      return '🛍️';
    case 'entertainment':
      return '🎬';
    case 'utilities':
      return '💡';
    case 'healthcare':
      return '⚕️';
    case 'salary':
      return '💼';
    case 'freelance':
      return '💻';
    case 'education':
      return '📚';
    case 'housing':
      return '🏠';
    default:
      // Fallback to type-based icon
      if (type === 'expense') return '💸';
      if (type === 'income') return '💰';
      if (type === 'invest') return '📈';
      if (type === 'savings') return '💲';
      return '📋';
  }
};

// Format currency with locale
export const formatCurrency = (amount: number | string) => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `₹ ${numAmount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
