import React from 'react';
import {Modal} from 'react-native';
import {View, Colors} from 'react-native-ui-lib';
import tailwind from 'twrnc';
import AddTransactionForm from './TransactionForm';

interface TransactionModalProps {
  txnId: string | null;
  visible: boolean;
  hideDialog: () => void;
  onSubmitTransaction: (data: any) => void;
}

const TransactionModal = ({
  txnId,
  visible,
  hideDialog,
  onSubmitTransaction,
}: TransactionModalProps) => {
  const handleTransactionSubmit = (data: any) => {
    // Process the transaction data
    onSubmitTransaction(data);
    // Close the dialog
    hideDialog();
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={hideDialog}
      transparent={true}
      animationType="slide">
      <View style={tailwind`flex-1 bg-black bg-opacity-50 justify-end`}>
        <View
          style={tailwind`bg-white rounded-t-3xl min-h-[80%] max-h-[95%]`}
          backgroundColor={Colors.white}>
          <AddTransactionForm
            txn={txnId}
            onSubmit={handleTransactionSubmit}
            onCancel={hideDialog}
          />
        </View>
      </View>
    </Modal>
  );
};

export default TransactionModal;
