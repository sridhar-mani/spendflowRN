import React, {useState} from 'react';
import {ScrollView} from 'react-native';
import {
  View,
  Text,
  TextField,
  Colors,
  TouchableOpacity,
} from 'react-native-ui-lib';
import DatePicker from 'react-native-date-picker';
import {format} from 'date-fns';
import tailwind from 'twrnc';
import {Formik} from 'formik';
import * as Yup from 'yup';
//@ts-ignore
import Ionicons from 'react-native-vector-icons/Ionicons';
import useStore from '../store';
import {suggestCategory} from '../utils/categoryPredictor';
import {useTheme} from '../constants/themeContext';

// Create validation schema with Yup
const TransactionSchema = Yup.object().shape({
  amount: Yup.string()
    .required('Amount is required')
    .test('is-valid-amount', 'Please enter a valid amount', value => {
      if (!value) return false;
      const numValue = parseFloat(value);
      return !isNaN(numValue) && numValue > 0;
    }),
  date: Yup.date().required('Date is required'),
  description: Yup.string()
    .required('Description is required')
    .min(2, 'Description must be at least 2 characters'),
  type: Yup.string()
    .required('Type is required')
    .oneOf(
      ['expense', 'income', 'invest', 'savings'],
      'Invalid transaction type',
    ),
  category: Yup.string().required('Category is required'),
  suggestedCategory: Yup.string(),
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
  const {theme, isDarkMode} = useTheme();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const txnEdit = txn
    ? transactionHistory?.find((each: any) => each.id === txn)
    : null;
  const initialValues = {
    type: txnEdit?.type ?? 'expense',
    description: txnEdit?.description ?? '',
    amount: txnEdit?.amount ? String(txnEdit.amount) : '',
    category: txnEdit?.category ?? '',
    date: txnEdit?.date ? new Date(txnEdit.date) : new Date(),
    tags: txnEdit?.tags ?? [],
    suggestedCategory: '',
  };

  const [selectedType, setSelectedType] = useState(initialValues.type);

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
    <View
      style={[
        tailwind`flex-1 rounded-t-3xl shadow-lg`,
        {backgroundColor: theme.background},
      ]}>
      {/* Header */}
      <View
        style={[
          tailwind`px-6 py-4 border-b rounded-t-3xl`,
          {
            backgroundColor: theme.backgroundSecondary,
            borderBottomColor: theme.border,
          },
        ]}>
        <View style={tailwind`flex-row items-center justify-between`}>
          <View style={tailwind`w-6`} />
          <Text
            text60
            style={[tailwind`font-bold text-center`, {color: theme.text}]}>
            {txnEdit ? 'Edit Transaction' : 'Add Transaction'}
          </Text>
          <TouchableOpacity
            onPress={onCancel}
            style={[
              tailwind`w-6 h-6 rounded-full items-center justify-center`,
              {backgroundColor: isDarkMode ? theme.border : '#e5e7eb'},
            ]}>
            <Ionicons name="close" size={14} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>
        <Text
          text80
          style={[tailwind`text-center mt-1`, {color: theme.textSecondary}]}>
          {txnEdit
            ? 'Update your transaction details'
            : 'Track your spending and income'}
        </Text>
      </View>
      <ScrollView style={tailwind`flex-1`} showsVerticalScrollIndicator={false}>
        <Formik
          initialValues={initialValues}
          validationSchema={TransactionSchema}
          onSubmit={values => {
            console.log('Form submitted with values:', values);
            try {
              const completeTransaction = {
                ...values,
                amount: parseFloat(values.amount),
                date: values.date.toISOString(),
                id: txnEdit?.id ?? Date.now().toString(),
              };
              console.log('Complete transaction:', completeTransaction);
              onSubmit(completeTransaction);
            } catch (error) {
              console.error('Error creating transaction:', error);
            }
          }}>
          {({
            values,
            errors,
            touched,
            handleChange,
            handleSubmit,
            setFieldValue,
          }) => (
            <View style={[tailwind`p-6`, {backgroundColor: theme.background}]}>
              {/* Transaction Type */}
              <View style={tailwind`mb-6`}>
                <Text
                  text70
                  style={[tailwind`mb-3 font-semibold`, {color: theme.text}]}>
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
                        tailwind`flex-1 px-4 py-3 rounded-xl border-2 shadow-sm`,
                        values.type === type
                          ? {
                              backgroundColor: theme.primary,
                              borderColor: theme.primary,
                            }
                          : {
                              backgroundColor: theme.cardBackground,
                              borderColor: theme.border,
                            },
                      ]}
                      activeOpacity={0.7}>
                      <Text
                        text70
                        style={[
                          tailwind`capitalize text-center font-semibold`,
                          {
                            color:
                              values.type === type ? '#FFFFFF' : theme.text,
                          },
                        ]}>
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>{' '}
              </View>{' '}
              {/* Amount */}
              <View style={tailwind`mb-6`}>
                <Text
                  text70
                  style={[tailwind`mb-2 font-semibold`, {color: theme.text}]}>
                  Amount (₹)
                </Text>
                <TextField
                  value={values.amount}
                  onChangeText={handleChange('amount')}
                  keyboardType="numeric"
                  placeholder="Enter amount"
                  placeholderTextColor={theme.textSecondary}
                  fieldStyle={[
                    tailwind`rounded-xl px-4 py-3 border`,
                    {
                      backgroundColor: theme.backgroundSecondary,
                      borderColor: theme.border,
                      color: theme.text,
                    },
                  ]}
                  error={!!(touched.amount && errors.amount)}
                  validationMessage={
                    touched.amount && errors.amount
                      ? typeof errors.amount === 'string'
                        ? errors.amount
                        : 'Invalid amount'
                      : undefined
                  }
                />
              </View>
              {/* Description */}
              <View style={tailwind`mb-6`}>
                <Text
                  text70
                  style={[tailwind`mb-2 font-semibold`, {color: theme.text}]}>
                  Description
                </Text>
                <TextField
                  value={values.description}
                  placeholder="Enter description"
                  placeholderTextColor={theme.textSecondary}
                  onChangeText={text => {
                    handleChange('description')(text);

                    // If description is being typed and category is empty, suggest a category
                    if (text.length > 3 && !values.category) {
                      const suggestedCategory = suggestCategory(
                        text,
                        values.type,
                      );
                      if (
                        suggestedCategory &&
                        categories.includes(suggestedCategory)
                      ) {
                        // Don't auto-set, just prepare suggestion
                        setFieldValue('suggestedCategory', suggestedCategory);
                      }
                    }
                  }}
                  fieldStyle={[
                    tailwind`rounded-xl px-4 py-3 border`,
                    {
                      backgroundColor: theme.backgroundSecondary,
                      borderColor: theme.border,
                      color: theme.text,
                    },
                  ]}
                  error={!!(touched.description && errors.description)}
                  validationMessage={
                    touched.description && errors.description
                      ? typeof errors.description === 'string'
                        ? errors.description
                        : 'Invalid description'
                      : undefined
                  }
                />

                {/* Category suggestion */}
                {!!(values.suggestedCategory && !values.category) && (
                  <View
                    style={[
                      tailwind`mt-3 p-3 rounded-xl border`,
                      {
                        backgroundColor: isDarkMode ? theme.border : '#dbeafe',
                        borderColor: theme.primary,
                      },
                    ]}>
                    <Text
                      style={[
                        tailwind`text-sm mb-2 font-medium`,
                        {color: theme.primary},
                      ]}>
                      💡 Suggested Category
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        setFieldValue('category', values.suggestedCategory)
                      }
                      style={[
                        tailwind`rounded-lg px-3 py-2 self-start`,
                        {
                          backgroundColor: isDarkMode
                            ? theme.primary
                            : '#93c5fd',
                        },
                      ]}>
                      <Text
                        style={[
                          tailwind`font-semibold capitalize`,
                          {color: isDarkMode ? '#FFFFFF' : theme.primary},
                        ]}>
                        {values.suggestedCategory}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              {/* Category */}
              <View style={tailwind`mb-6`}>
                <Text
                  text70
                  style={[tailwind`mb-3 font-semibold`, {color: theme.text}]}>
                  Category
                </Text>
                <View style={tailwind`flex-row flex-wrap gap-2`}>
                  {categories.map((category: string) => (
                    <TouchableOpacity
                      key={category}
                      onPress={() => setFieldValue('category', category)}
                      style={[
                        tailwind`px-4 py-2 rounded-xl border-2 shadow-sm`,
                        values.category === category
                          ? {
                              backgroundColor: theme.success,
                              borderColor: theme.success,
                            }
                          : {
                              backgroundColor: theme.backgroundSecondary,
                              borderColor: theme.border,
                            },
                      ]}>
                      <Text
                        text80
                        style={[
                          tailwind`capitalize font-medium`,
                          {
                            color:
                              values.category === category
                                ? '#FFFFFF'
                                : theme.text,
                          },
                        ]}>
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {touched.category && errors.category && (
                  <Text style={tailwind`text-red-500 text-sm mt-2`}>
                    {typeof errors.category === 'string'
                      ? errors.category
                      : 'Please select a category'}
                  </Text>
                )}
              </View>{' '}
              {/* Date */}
              <View style={tailwind`mb-6`}>
                <Text
                  text70
                  style={[tailwind`mb-3 font-semibold`, {color: theme.text}]}>
                  Date
                </Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  style={[
                    tailwind`rounded-xl px-4 py-3 border shadow-sm flex-row items-center justify-between`,
                    {
                      backgroundColor: theme.backgroundSecondary,
                      borderColor: theme.border,
                    },
                  ]}>
                  <Text
                    text70
                    style={[tailwind`font-medium`, {color: theme.text}]}>
                    {format(values.date, 'MMMM do, yyyy')}
                  </Text>
                  <Ionicons
                    name="calendar-outline"
                    size={20}
                    color={theme.textSecondary}
                  />
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
              </View>{' '}
              {/* Action Buttons */}
              <View style={tailwind`flex-row gap-4 pt-6 pb-2`}>
                <TouchableOpacity
                  onPress={onCancel}
                  style={[
                    tailwind`flex-1 rounded-xl py-4 items-center border`,
                    {
                      backgroundColor: theme.backgroundSecondary,
                      borderColor: theme.border,
                    },
                  ]}>
                  <Text
                    text70
                    style={[
                      tailwind`font-semibold`,
                      {color: theme.textSecondary},
                    ]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSubmit}
                  style={[
                    tailwind`flex-1 rounded-xl py-4 items-center shadow-lg`,
                    {backgroundColor: theme.primary},
                  ]}>
                  <Text
                    text70
                    style={[tailwind`font-semibold`, {color: '#FFFFFF'}]}>
                    {txnEdit ? 'Update' : 'Add Transaction'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      </ScrollView>
    </View>
  );
}
