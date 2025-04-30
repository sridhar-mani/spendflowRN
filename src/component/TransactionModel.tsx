import React from 'react';
import {Portal, Dialog} from 'react-native-paper';
import AddTransactionForm from './TransactionForm';

const TransactionModal = ({
  txnId,
  visible,
  hideDialog,
  onSubmitTransaction,
}) => {
  const handleTransactionSubmit = data => {
    // Process the transaction data
    onSubmitTransaction(data);
    // Close the dialog
    hideDialog();
  };

  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={hideDialog}
        style={{backgroundColor: 'transparent', elevation: 0}}
        dismissable={true}>
        <AddTransactionForm
          txn={txnId}
          onSubmit={handleTransactionSubmit}
          onCancel={hideDialog}
        />
      </Dialog>
    </Portal>
  );
};

export default TransactionModal;
