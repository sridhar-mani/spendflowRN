import React, {useState, useRef, useEffect, useMemo} from 'react';
import {View, ScrollView, TouchableOpacity, Dimensions} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Chip,
  HelperText,
  Menu,
  Divider,
} from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import {format} from 'date-fns';
import tw from 'twrnc';
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
  accountName: Yup.string().optional(),
});

// Transaction form component
export default function AddTransactionForm({
  txn = '',
  onSubmit,
  accounts = [],
  onCancel,
}) {
  // Get transaction state from Zustand store
  const {
    transaction,
    updateTransaction,
    resetTransaction,
    addTagToTransaction,
    removeTagFromTransaction,
    transactionTypes,
    getCategoriesForType,
    addTag,
    addCategory,
    transactionHistory,
    editTransaction,
  } = useStore();

  const [newTag, setNewTag] = useState('');
  const [typeMenuVisible, setTypeMenuVisible] = useState(false);
  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);
  const [accountMenuVisible, setAccountMenuVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // References for menu positioning
  const typeButtonRef = useRef(null);
  const categoryButtonRef = useRef(null);
  const accountButtonRef = useRef(null);

  // Menu position state
  const [typeMenuPosition, setTypeMenuPosition] = useState({x: 0, y: 0});
  const [categoryMenuPosition, setCategoryMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const [accountMenuPosition, setAccountMenuPosition] = useState({x: 0, y: 0});

  // Calculate menu position when button is pressed
  const measureButton = (ref, setPosition, setVisible) => {
    if (ref.current) {
      ref.current.measure((fx, fy, width, height, px, py) => {
        setPosition({x: px, y: py + height});
        setVisible(true);
      });
    }
  };

  const handleAddTag = () => {
    if (newTag && !transaction.tags.includes(newTag)) {
      addTagToTransaction(newTag);
      addTag(newTag); // Also add to global tags
      setNewTag('');
    }
  };

  const handleRemoveTag = tag => {
    removeTagFromTransaction(tag);
  };

  const formatCategoryName = name => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const txnEdit = useMemo(() => {
    console.log(txn);
    return transactionHistory.find(each => each.id === txn);
  }, [txn, transactionHistory]);

  console.log(txnEdit);

  return (
    <View style={tw`bg-white rounded-lg`}>
      {/* Header */}
      <View style={tw`bg-gray-100 p-4 rounded-t-lg`}>
        <Text style={tw`text-lg font-bold text-center`}>
          {!txnEdit ? 'Add Transaction' : 'Edit Transaction'}
        </Text>
      </View>

      <ScrollView style={tw`max-h-[500px] px-4 pt-4`}>
        <Formik
          key={txnEdit?.id ?? 'new'}
          initialValues={{
            type: txnEdit?.type || transactionTypes.EXPENSE,
            description: txnEdit?.description || '',
            amount: parseFloat(txnEdit?.amount ?? 0).toFixed(2) || '',
            date: txnEdit?.date || new Date(),
            category: txnEdit?.category || '',
            accountName:
              txnEdit?.accountName ||
              (accounts.length > 0 ? accounts[0].name : ''),
            tags: txnEdit?.tags || [],
          }}
          validationSchema={TransactionSchema}
          onSubmit={(values, {resetForm}) => {
            const numericAmount = parseFloat(values.amount);
            if (isNaN(numericAmount)) return;
            const d =
              values.date instanceof Date ? values.date : new Date(values.date);

            // Create complete transaction object with tags
            const completeTransaction = {
              ...values,
              amount: numericAmount,
              date: d.toISOString(),
              tags: transaction.tags,
            };

            // Update store
            Object.keys(values).forEach(key => {
              updateTransaction(key, values[key]);
            });

            // Submit to parent component
            onSubmit(completeTransaction);
            editTransaction(txnEdit?.id, completeTransaction);

            // Reset form and store
            resetForm();
            resetTransaction();
          }}>
          {({
            handleChange,
            handleSubmit,
            setFieldValue,
            values,
            errors,
            touched,
          }) => {
            if (!(values.date instanceof Date)) {
              values.date = new Date(values.date);
            }

            return (
              <View>
                {/* Type and Amount Row */}
                <View style={tw`flex-row mb-4`}>
                  {/* Type */}
                  <View style={tw`flex-1 mr-2`}>
                    <Text style={tw`text-sm mb-1 text-gray-700`}>Type</Text>
                    <TouchableOpacity
                      ref={typeButtonRef}
                      onPress={() =>
                        measureButton(
                          typeButtonRef,
                          setTypeMenuPosition,
                          setTypeMenuVisible,
                        )
                      }
                      style={tw`p-2.5 h-14 border border-gray-500 rounded bg-white justify-center`}>
                      <Text>
                        {values.type.charAt(0).toUpperCase() +
                          values.type.slice(1)}
                      </Text>
                    </TouchableOpacity>
                    <Menu
                      visible={typeMenuVisible}
                      onDismiss={() => setTypeMenuVisible(false)}
                      anchor={typeMenuPosition}>
                      {Object.values(transactionTypes).map(type => (
                        <Menu.Item
                          key={String(type)}
                          onPress={() => {
                            setFieldValue('type', type);
                            setFieldValue('category', '');
                            updateTransaction('type', type);
                            updateTransaction('category', '');
                            setTypeMenuVisible(false);
                          }}
                          title={type.charAt(0).toUpperCase() + type.slice(1)}
                        />
                      ))}
                    </Menu>
                    {touched.type && errors.type && (
                      <HelperText type="error">{errors.type}</HelperText>
                    )}
                  </View>

                  {/* Amount */}
                  <View style={tw`flex-1`}>
                    <Text style={tw`text-sm mb-1 text-gray-700`}>Amount</Text>
                    <TextInput
                      style={tw`bg-white h-14`}
                      mode="outlined"
                      keyboardType="numeric"
                      placeholder="0.00"
                      value={values.amount}
                      onChangeText={value => {
                        handleChange('amount')(value);
                        updateTransaction('amount', value);
                      }}
                      error={touched.amount && !!errors.amount}
                    />
                    {touched.amount && errors.amount && (
                      <HelperText type="error">{errors.amount}</HelperText>
                    )}
                  </View>
                </View>

                {/* Description */}
                <View style={tw`mb-4`}>
                  <Text style={tw`text-sm mb-1 text-gray-700`}>
                    Description
                  </Text>
                  <TextInput
                    style={tw`bg-white`}
                    mode="outlined"
                    placeholder="Enter description"
                    value={values.description}
                    onChangeText={value => {
                      handleChange('description')(value);
                      updateTransaction('description', value);
                    }}
                    error={touched.description && !!errors.description}
                  />
                  {touched.description && errors.description && (
                    <HelperText type="error">{errors.description}</HelperText>
                  )}
                </View>

                {/* Category and Date Row */}
                <View style={tw`flex-row mb-4`}>
                  {/* Category */}
                  <View style={tw`flex-1 mr-2`}>
                    <Text style={tw`text-sm mb-1 text-gray-700`}>Category</Text>
                    <TouchableOpacity
                      ref={categoryButtonRef}
                      onPress={() =>
                        measureButton(
                          categoryButtonRef,
                          setCategoryMenuPosition,
                          setCategoryMenuVisible,
                        )
                      }
                      style={tw`p-2.5 h-14 border border-gray-300 rounded bg-white justify-center`}>
                      <Text>
                        {values.category
                          ? formatCategoryName(values.category)
                          : 'Select category'}
                      </Text>
                    </TouchableOpacity>
                    <Menu
                      visible={categoryMenuVisible}
                      onDismiss={() => setCategoryMenuVisible(false)}
                      anchor={categoryMenuPosition}>
                      {getCategoriesForType(values.type).map(category => (
                        <Menu.Item
                          key={category}
                          onPress={() => {
                            setFieldValue('category', category);
                            updateTransaction('category', category);
                            setCategoryMenuVisible(false);
                          }}
                          title={formatCategoryName(category)}
                        />
                      ))}
                      <Divider />
                      <Menu.Item
                        title="+ Add New Category"
                        onPress={() => {
                          // Here you could show a dialog to add new category
                          // For now, just as an example, add a random one
                          const newCategory = `custom-${Math.floor(
                            Math.random() * 1000,
                          )}`;
                          addCategory(values.type, newCategory);
                          setFieldValue('category', newCategory);
                          updateTransaction('category', newCategory);
                          setCategoryMenuVisible(false);
                        }}
                      />
                    </Menu>
                    {touched.category && errors.category && (
                      <HelperText type="error">{errors.category}</HelperText>
                    )}
                  </View>

                  {/* Date */}
                  <View style={tw`flex-1`}>
                    <Text style={tw`text-sm mb-1 text-gray-700`}>Date</Text>
                    <TouchableOpacity
                      onPress={() => setShowDatePicker(true)}
                      style={tw`p-2.5 h-14 border border-gray-300 rounded bg-white justify-center`}>
                      <Text>{format(values.date, 'MMMM do, yyyy')}</Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                      <DatePicker
                        modal
                        mode={'date'}
                        open={showDatePicker}
                        date={
                          values.date instanceof Date
                            ? values.date
                            : new Date(values.date)
                        }
                        onConfirm={selectedDate => {
                          setShowDatePicker(false);
                          if (selectedDate) {
                            setFieldValue('date', selectedDate);
                            updateTransaction('date', selectedDate);
                          }
                        }}
                        onCancel={() => setShowDatePicker(false)}
                      />
                    )}
                    {touched.date && errors.date && (
                      <HelperText type="error">{errors.date}</HelperText>
                    )}
                  </View>
                </View>

                {/* Tags */}
                <View style={tw`mb-6`}>
                  <Text style={tw`text-sm mb-1 text-gray-700`}>Tags</Text>
                  <View style={tw`flex-row flex-wrap mb-2`}>
                    {values.tags.map(tag => (
                      <Chip
                        key={tag}
                        style={tw`m-1`}
                        onClose={() => handleRemoveTag(tag)}>
                        #{tag}
                      </Chip>
                    ))}
                  </View>
                  <View style={tw`flex-row items-center`}>
                    <TextInput
                      style={tw`flex-1 bg-white mr-2`}
                      mode="outlined"
                      placeholder="Enter tag (e.g. vacation)"
                      value={newTag}
                      onChangeText={setNewTag}
                    />
                    <Button
                      mode="contained"
                      disabled={!newTag}
                      onPress={handleAddTag}
                      style={tw`rounded-full bg-violet-500 h-14 w-14 items-center justify-center`}
                      contentStyle={tw`h-14 w-14`}
                      labelStyle={tw`m-0 p-0 text-white text-xl`}>
                      +
                    </Button>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={tw`p-2 flex flex-row items-center justify-evenly`}>
                  <Button
                    mode="contained"
                    onPress={handleSubmit}
                    style={tw`rounded-md flex-1 mr-2 bg-purple-600 py-1 mb-4`}>
                    Save Transaction
                  </Button>
                  <Button
                    mode="text"
                    onPress={() => {
                      resetTransaction();
                      onCancel();
                    }}
                    style={tw`rounded-md flex-1 py-1 mb-4`}
                    textColor="red">
                    Cancel
                  </Button>
                </View>
              </View>
            );
          }}
        </Formik>
      </ScrollView>
    </View>
  );
}
