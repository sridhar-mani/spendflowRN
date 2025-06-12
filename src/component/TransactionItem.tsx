import {format} from 'date-fns';
import React from 'react';
import {
  View,
  Text,
  Card,
  Colors,
  Chip,
  TouchableOpacity,
} from 'react-native-ui-lib';
import tailwind from 'twrnc';
//@ts-ignore
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useTheme} from '../constants/themeContext';

interface TransactionItemProps {
  item: {
    id: string;
    description: string;
    date: string;
    category: string;
    type: string;
    amount: number | string;
    tags?: string[];
  };
  onEdit?: ((item: any) => void) | null;
  onDelete?: ((id: string) => void) | null;
}

const TransactionItem = ({
  item,
  onEdit = null,
  onDelete = null,
}: TransactionItemProps) => {
  const {theme, isDarkMode} = useTheme();

  // Helper function to determine transaction color
  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'expense':
        return theme.expenseColor;
      case 'income':
        return theme.incomeColor;
      case 'investment':
      case 'invest':
        return theme.investmentColor;
      case 'transfer':
        return theme.primary;
      default:
        return theme.textSecondary;
    }
  };

  // Format currency
  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `₹ ${numAmount.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getCategoryEmoji = (category: string, type: string) => {
    const emojiMap: Record<string, string> = {
      food: '🍕',
      transportation: '🚗',
      shopping: '🛍️',
      entertainment: '🎬',
      salary: '💼',
      freelance: '💻',
    };

    return (
      emojiMap[category] ||
      (type === 'expense' ? '💸' : type === 'income' ? '💰' : '📈')
    );
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'expense':
        return 'arrow-down-circle';
      case 'income':
        return 'arrow-up-circle';
      case 'investment':
      case 'invest':
        return 'trending-up';
      default:
        return 'swap-horizontal';
    }
  };

  return (
    <Card
      style={tailwind`mb-3 mx-0 rounded-2xl border-0 shadow-sm`}
      backgroundColor={theme.cardBackground}>
      <View style={tailwind`p-4`}>
        <View style={tailwind`flex-row items-center justify-between`}>
          {/* Left Section: Icon + Details */}
          <View style={tailwind`flex-row items-center flex-1 mr-4`}>
            {/* Category Icon */}
            <View
              style={[
                tailwind`w-12 h-12 rounded-2xl items-center justify-center mr-3`,
                {backgroundColor: `${getTransactionColor(item.type)}15`},
              ]}>
              <Text style={tailwind`text-xl`}>
                {getCategoryEmoji(item.category, item.type)}
              </Text>
            </View>

            {/* Transaction Details */}
            <View style={tailwind`flex-1`}>
              <Text
                text60
                style={[tailwind`font-semibold mb-1`, {color: theme.text}]}
                numberOfLines={1}>
                {item.description}
              </Text>
              <View style={tailwind`flex-row items-center flex-wrap`}>
                <Text
                  text80
                  style={[tailwind`mr-3`, {color: theme.textSecondary}]}>
                  {format(new Date(item.date), 'MMM d, yyyy')}
                </Text>
                <View
                  style={[
                    tailwind`px-2 py-0.5 rounded-lg`,
                    {backgroundColor: `${getTransactionColor(item.type)}10`},
                  ]}>
                  <Text
                    text90
                    style={[
                      tailwind`font-medium capitalize text-xs`,
                      {color: getTransactionColor(item.type)},
                    ]}>
                    {item.category}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Right Section: Amount */}
          <View style={tailwind`items-end`}>
            <Text
              text50
              color={getTransactionColor(item.type)}
              style={tailwind`font-bold mb-1`}>
              {item.type === 'expense' ? '-' : '+'}
              {formatCurrency(item.amount)}
            </Text>
            <View style={tailwind`flex-row items-center`}>
              <Ionicons
                name={getTransactionIcon(item.type)}
                size={12}
                color={getTransactionColor(item.type)}
                style={tailwind`mr-1`}
              />
              <Text
                text90
                color={getTransactionColor(item.type)}
                style={tailwind`capitalize font-medium`}>
                {item.type}
              </Text>
            </View>
          </View>
        </View>

        {/* Tags Section */}
        {item.tags && item.tags.length > 0 && (
          <View
            style={[
              tailwind`flex-row flex-wrap mt-3 pt-3 border-t`,
              {borderTopColor: theme.border},
            ]}>
            {item.tags.map((tag: string) => (
              <Chip
                key={tag}
                label={`#${tag}`}
                labelStyle={[
                  tailwind`text-xs font-medium`,
                  {color: theme.text},
                ]}
                backgroundColor={theme.backgroundSecondary}
                style={tailwind`mr-2 mb-1`}
              />
            ))}
          </View>
        )}

        {/* Action Buttons */}
        {(onEdit || onDelete) && (
          <View
            style={[
              tailwind`flex-row justify-end mt-4 pt-3 border-t`,
              {borderTopColor: theme.border},
            ]}>
            {onEdit && (
              <TouchableOpacity
                onPress={() => onEdit(item)}
                style={[
                  tailwind`flex-row items-center mr-6 px-3 py-2 rounded-lg`,
                  {backgroundColor: `${theme.primary}15`},
                ]}
                activeOpacity={0.7}>
                <Ionicons name="pencil" size={14} color={theme.primary} />
                <Text
                  text80
                  style={[
                    tailwind`ml-1.5 font-medium`,
                    {color: theme.primary},
                  ]}>
                  Edit
                </Text>
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity
                onPress={() => onDelete(item.id)}
                style={[
                  tailwind`flex-row items-center px-3 py-2 rounded-lg`,
                  {backgroundColor: `${theme.error}15`},
                ]}
                activeOpacity={0.7}>
                <Ionicons name="trash" size={14} color={theme.error} />
                <Text
                  text80
                  style={[tailwind`ml-1.5 font-medium`, {color: theme.error}]}>
                  Delete
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </Card>
  );
};

export default TransactionItem;
