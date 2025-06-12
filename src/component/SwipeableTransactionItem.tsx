import React, {useRef} from 'react';
import {Animated} from 'react-native';
import {View, Text, Colors, TouchableOpacity} from 'react-native-ui-lib';
// @ts-ignore - Suppress deprecation warning temporarily
import {Swipeable} from 'react-native-gesture-handler';
import tailwind from 'twrnc';
//@ts-ignore
import Ionicons from 'react-native-vector-icons/Ionicons';
import TransactionItem from './TransactionItem';
import useStore from '../store';

interface SwipeableTransactionItemProps {
  item: {
    id: string;
    description: string;
    date: string;
    category: string;
    type: string;
    amount: number | string;
    tags?: string[];
  };
  onEditPress?: ((item: any) => void) | null;
}

const SwipeableTransactionItem = ({
  item,
  onEditPress,
}: SwipeableTransactionItemProps) => {
  // @ts-ignore - Suppress deprecation warning temporarily
  const swipeableRef = useRef<Swipeable>(null);
  const {deleteTransaction} = useStore() as any;

  const handleDelete = () => {
    if (swipeableRef.current) {
      swipeableRef.current.close();
    }
    // Show confirmation dialog
    setTimeout(() => {
      // Allow the swipe animation to finish
      deleteTransaction(item.id);
    }, 300);
  };

  const handleEdit = () => {
    if (swipeableRef.current) {
      swipeableRef.current.close();
    }

    if (onEditPress) {
      setTimeout(() => {
        onEditPress(item);
      }, 300);
    }
  };
  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
  ) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [80, 0],
    });

    return (
      <View style={tailwind`flex-row`}>
        {/* Edit button */}
        <TouchableOpacity
          onPress={handleEdit}
          style={[
            tailwind`justify-center items-center w-20 rounded-l-2xl`,
            {backgroundColor: '#3b82f6'},
          ]}>
          <Animated.View
            style={[
              tailwind`justify-center items-center`,
              {transform: [{translateX: trans}]},
            ]}>
            <Ionicons name="pencil" size={20} color="white" />
            <Text style={tailwind`text-white text-xs mt-1 font-medium`}>
              Edit
            </Text>
          </Animated.View>
        </TouchableOpacity>

        {/* Delete button */}
        <TouchableOpacity
          onPress={handleDelete}
          style={[
            tailwind`justify-center items-center w-20`,
            {backgroundColor: '#ef4444'},
          ]}>
          <Animated.View
            style={[
              tailwind`justify-center items-center`,
              {transform: [{translateX: trans}]},
            ]}>
            <Ionicons name="trash" size={20} color="white" />
            <Text style={tailwind`text-white text-xs mt-1 font-medium`}>
              Delete
            </Text>
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      rightThreshold={40}>
      <TransactionItem
        item={item}
        onEdit={onEditPress}
        onDelete={null} // We handle delete through swipe
      />
    </Swipeable>
  );
};

export default SwipeableTransactionItem;
