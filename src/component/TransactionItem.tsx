import {format} from 'date-fns';
import {View} from 'react-native';
import {Card, Chip, IconButton, Text} from 'react-native-paper';
import tw from 'twrnc';

const TransactionItem = ({item, onEdit = null, onDelete = null}) => {
  // Helper function to determine transaction color
  const getTransactionColor = type => {
    switch (type) {
      case 'expense':
        return 'red';
      case 'income':
        return 'green';
      case 'investment':
        return 'gold';
      case 'transfer':
        return 'blue';
      default:
        return 'gray';
    }
  };

  // Format currency
  const formatCurrency = amount => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <Card style={tw`mb-3 rounded-lg`}>
      <Card.Content style={tw`mt-0 p-3`}>
        <View style={tw`flex-row  justify-between items-center`}>
          <View style={tw`flex-1`}>
            <Text style={tw`text-base font-bold`}>{item.description}</Text>
            <Text style={tw`text-xs text-gray-500`}>
              {format(new Date(item.date), 'MMMM d, yyyy')} • {item.category}
            </Text>
          </View>

          <Text
            style={tw`text-lg font-bold text-${getTransactionColor(
              item.type,
            )}-600`}>
            {formatCurrency(item.amount)}
          </Text>
        </View>

        {item.tags && item.tags.length > 0 && (
          <View style={tw`flex-row flex-wrap mt-2`}>
            {item.tags.map(tag => (
              <Chip
                key={tag}
                style={tw`mr-1 mb-1 bg-gray-100`}
                textStyle={tw`text-xs`}>
                #{tag}
              </Chip>
            ))}
          </View>
        )}
      </Card.Content>

      {onEdit && onDelete && (
        <Card.Actions style={tw`justify-end pt-0`}>
          <IconButton icon="pencil" size={20} onPress={() => onEdit(item)} />
          <IconButton
            icon="delete"
            size={20}
            onPress={() => onDelete(item.id)}
          />
        </Card.Actions>
      )}
    </Card>
  );
};

export default TransactionItem;
