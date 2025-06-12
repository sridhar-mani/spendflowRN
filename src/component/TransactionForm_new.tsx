import React, {useState} from 'react';
import {ScrollView} from 'react-native';
import {
  View,
  Text,
  TextField,
  Button,
  Colors,
  TouchableOpacity,
} from 'react-native-ui-lib';
import DatePicker from 'react-native-date-picker';
import {format} from 'date-fns';
import tailwind from 'twrnc';
import {Formik} from 'formik';
import * as Yup from 'yup';
import useStore from '../store';

// Create validation schema with Yup
const TransactionSchema = Yup.object().shape({
  amount: Yup.string()
    .required('Amount is required')
    .test(
      'is-valid-amount',
      'Please enter a valid amount',
      value => !isNaN(parseFloat(value || '0')),
    ),
  date: Yup.date().required('Date is required'),
  description: Yup.string().required('Description is required'),
  type: Yup.string().required('Type is required'),
  category: Yup.string().required('Category is required'),
});

interface TransactionFormProps {
  readonly txn?: string | null;
  readonly onSubmit: (data: any) => void;
  readonly onCancel: () => void;
}

export default function AddTransactionForm({
  txn = null,
  onSubmit,
  onCancel,
}: TransactionFormProps) {
  const {getCategoriesForType, transactionHistory} = useStore() as any;

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedType, setSelectedType] = useState('expense');

  const txnEdit = txn
    ? transactionHistory?.find((each: any) => each.id === txn)
    : null;

  const initialValues = {
    type: txnEdit?.type || 'expense',
    description: txnEdit?.description || '',
    amount: txnEdit?.amount ? String(txnEdit.amount) : '',
    category: txnEdit?.category || '',
    date: txnEdit?.date ? new Date(txnEdit.date) : new Date(),
    tags: txnEdit?.tags || [],
  };

  const categories = getCategoriesForType
    ? getCategoriesForType(selectedType)
    : [
        'food',
        'transport',
        'entertainment',
        'shopping',
        'utilities',
        'healthcare',
        'other',
      ];

  return (
    <View style={tailwind`bg-white rounded-t-3xl`}>
      {/* Header */}
      <View style={tailwind`p-4 border-b border-gray-200`}>
        <Text
          text60
          color={Colors.grey10}
          style={tailwind`font-bold text-center`}>
          {txnEdit ? 'Edit Transaction' : 'Add Transaction'}
        </Text>
      </View>

      <ScrollView style={tailwind`max-h-96`}>
        <Formik
          initialValues={initialValues}
          validationSchema={TransactionSchema}
          onSubmit={values => {
            const completeTransaction = {
              ...values,
              amount: parseFloat(values.amount),
              date: values.date.toISOString(),
              id: txnEdit?.id || Date.now().toString(),
            };
            onSubmit(completeTransaction);
          }}>
          {({
            values,
            errors,
            touched,
            handleChange,
            handleSubmit,
            setFieldValue,
          }) => (
            <View style={tailwind`p-4`}>
              {/* Transaction Type */}
              <View style={tailwind`mb-4`}>
                <Text
                  text70
                  color={Colors.grey10}
                  style={tailwind`mb-2 font-semibold`}>
                  Transaction Type
                </Text>
                <View style={tailwind`flex-row gap-2`}>
                  {['expense', 'income', 'invest'].map(type => (
                    <TouchableOpacity
                      key={type}
                      onPress={() => {
                        setFieldValue('type', type);
                        setSelectedType(type);
                        setFieldValue('category', ''); // Reset category when type changes
                      }}
                      style={[
                        tailwind`px-4 py-2 rounded-lg border`,
                        values.type === type
                          ? tailwind`bg-blue-500 border-blue-500`
                          : tailwind`bg-gray-100 border-gray-300`,
                      ]}>
                      <Text
                        text80
                        color={
                          values.type === type ? Colors.white : Colors.grey30
                        }
                        style={tailwind`capitalize`}>
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Amount */}
              <View style={tailwind`mb-4`}>
                {' '}
                <TextField
                  label="Amount (₹)"
                  value={values.amount}
                  onChangeText={handleChange('amount')}
                  keyboardType="numeric"
                  fieldStyle={tailwind`bg-gray-50 rounded-lg px-4 py-3`}
                  error={!!(touched.amount && errors.amount)}
                />
              </View>

              {/* Description */}
              <View style={tailwind`mb-4`}>
                <TextField
                  label="Description"
                  value={values.description}
                  onChangeText={handleChange('description')}
                  fieldStyle={tailwind`bg-gray-50 rounded-lg px-4 py-3`}
                  error={!!(touched.description && errors.description)}
                />
              </View>

              {/* Category */}
              <View style={tailwind`mb-4`}>
                <Text
                  text70
                  color={Colors.grey10}
                  style={tailwind`mb-2 font-semibold`}>
                  Category
                </Text>
                <View style={tailwind`flex-row flex-wrap gap-2`}>
                  {categories.map((category: string) => (
                    <TouchableOpacity
                      key={category}
                      onPress={() => setFieldValue('category', category)}
                      style={[
                        tailwind`px-3 py-2 rounded-lg border`,
                        values.category === category
                          ? tailwind`bg-green-500 border-green-500`
                          : tailwind`bg-gray-100 border-gray-300`,
                      ]}>
                      <Text
                        text80
                        color={
                          values.category === category
                            ? Colors.white
                            : Colors.grey30
                        }
                        style={tailwind`capitalize`}>
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Date */}
              <View style={tailwind`mb-4`}>
                <Text
                  text70
                  color={Colors.grey10}
                  style={tailwind`mb-2 font-semibold`}>
                  Date
                </Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  style={tailwind`bg-gray-50 rounded-lg px-4 py-3 border border-gray-300`}>
                  <Text text70 color={Colors.grey10}>
                    {format(values.date, 'MMMM do, yyyy')}
                  </Text>
                </TouchableOpacity>

                <DatePicker
                  modal
                  open={showDatePicker}
                  date={values.date}
                  mode="date"
                  onConfirm={selectedDate => {
                    setShowDatePicker(false);
                    setFieldValue('date', selectedDate);
                  }}
                  onCancel={() => setShowDatePicker(false)}
                />
              </View>

              {/* Action Buttons */}
              <View style={tailwind`flex-row gap-3 pt-4`}>
                <Button
                  label="Cancel"
                  onPress={onCancel}
                  backgroundColor={Colors.grey70}
                  style={tailwind`flex-1 h-12 rounded-lg`}
                  labelStyle={{color: Colors.grey20}}
                />
                <Button
                  label={txnEdit ? 'Update' : 'Add Transaction'}
                  onPress={handleSubmit}
                  backgroundColor={Colors.primary}
                  style={tailwind`flex-1 h-12 rounded-lg`}
                  labelStyle={{color: Colors.white}}
                />
              </View>
            </View>
          )}
        </Formik>
      </ScrollView>
    </View>
  );
}
