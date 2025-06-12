import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Camera, useCameraDevice} from 'react-native-vision-camera';
import {Alert, ActivityIndicator, View as RNView} from 'react-native';
import * as RNFS from 'react-native-fs';
import TextRecognition from '@react-native-ml-kit/text-recognition';
import {
  View,
  Text,
  Button,
  Card,
  Colors,
  BorderRadiuses,
  TouchableOpacity,
  Badge,
  LoaderScreen,
} from 'react-native-ui-lib';
import tailwind from 'twrnc';
//@ts-ignore
import Ionicons from 'react-native-vector-icons/Ionicons';
import TransactionModal from '../component/TransactionModel';
import useStore from '../store';
import {useTheme} from '../constants/themeContext';

const CameraScreen = () => {
  const {theme, isDarkMode} = useTheme();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingResults, setProcessingResults] = useState<string>('');
  const [captureMode, setCaptureMode] = useState<'NORMAL' | 'ACCURATE'>(
    'NORMAL',
  );
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const [cameraPosition, setCameraPosition] = useState<'front' | 'back'>(
    'back',
  );
  const [showCamera, setShowCamera] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const {addTransactionToHistory} = useStore() as any;

  const device = useCameraDevice(cameraPosition);
  const camera = useRef<Camera>(null);

  const handleTransactionSubmit = (data: any) => {
    addTransactionToHistory(data);
    setDialogVisible(false);
  };

  useEffect(() => {
    const requestCameraPerm = async () => {
      const state = await Camera.requestCameraPermission();
      console.log('Permission state:', state);
      if (state === 'denied') {
        Alert.alert(
          'Camera Permission',
          'Camera access is required to scan receipts.',
        );
      }
    };

    requestCameraPerm();
  }, []);

  // Handle capture button press
  const onCapturePress = async () => {
    if (isProcessing || !camera.current) {
      return;
    }

    setIsProcessing(true);

    try {
      // Take a photo
      const photo = await camera.current.takePhoto({
        flash: flash,
      });

      console.log(
        'Processing photo with dimensions:',
        photo.width,
        'x',
        photo.height,
        'at path:',
        photo.path,
      ); // Use ML Kit Text Recognition to process the image
      const result = await TextRecognition.recognize(photo.path);

      // Extract text and build a readable result
      let extractedText = '';
      result.blocks.forEach(block => {
        block.lines.forEach(line => {
          extractedText += line.text + '\n';
        });
      });
      const displayResult = extractedText.trim() || 'No text detected';
      // Process the text to extract receipt information
      const enhancedResult = processReceiptText(displayResult);
      setProcessingResults(enhancedResult);
      console.log('Processing result:', enhancedResult);

      // Clean up temporary photo file
      await RNFS.unlink(photo.path).catch(err =>
        console.log('Error removing temp file:', err),
      );
    } catch (error) {
      console.error('Error processing photo:', error);
      setProcessingResults(`Error: ${error}`);
    } finally {
      setIsProcessing(false);
    }
  };
  const toggleCaptureMode = () => {
    setCaptureMode(prev => (prev === 'NORMAL' ? 'ACCURATE' : 'NORMAL'));
  };
  const toggleFlash = () => {
    setFlash(prev => (prev === 'off' ? 'on' : 'off'));
  };
  const toggleCameraPosition = () => {
    setCameraPosition(prev => (prev === 'back' ? 'front' : 'back'));
  }; // Process receipt-specific text
  const processReceiptText = (text: string): string => {
    if (!text || text === 'No text detected') {
      return text;
    }

    // Common receipt patterns
    const totalPattern = /(total|amount|sum).*?(\d+[.,]\d+)/i;
    const datePattern = /\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4}/;

    // Extract total amount
    const totalMatch = totalPattern.exec(text);
    const total = totalMatch ? totalMatch[2] : null;

    // Extract date
    const dateMatch = datePattern.exec(text);
    const date = dateMatch ? dateMatch[0] : null;

    // Add extracted info
    let processedText = text;
    if (total || date) {
      processedText += '\n\n--- Receipt Details ---';
      if (total) {
        processedText += `\nTotal Amount: ${total}`;
      }
      if (date) {
        processedText += `\nDate: ${date}`;
      }
    }

    return processedText;
  };
  return (
    <View flex style={tailwind`bg-black`}>
      <SafeAreaView style={tailwind`flex-1`}>
        {/* Header */}
        <Card
          style={tailwind`mx-4 mt-3 p-5 bg-black bg-opacity-80 rounded-2xl`}
          backgroundColor={Colors.rgba(Colors.black, 0.8)}
          borderRadius={BorderRadiuses.br20}>
          <View
            row
            spread
            centerV
            style={tailwind`flex-row justify-between items-center`}>
            <Text white text20 style={tailwind`text-white text-xl font-bold`}>
              SpendFlow Camera
            </Text>
            <View row style={tailwind`flex-row gap-2`}>
              <Button
                size="small"
                backgroundColor={Colors.blue30}
                label={`Mode: ${captureMode}`}
                labelStyle={tailwind`text-white text-xs font-semibold`}
                onPress={toggleCaptureMode}
                style={tailwind`mr-2 rounded-lg`}
              />
              <Button
                size="small"
                backgroundColor={
                  flash === 'on' ? Colors.yellow30 : Colors.blue30
                }
                label={`Flash: ${flash}`}
                labelStyle={tailwind`text-white text-xs font-semibold`}
                onPress={toggleFlash}
                style={tailwind`mr-2 rounded-lg`}
              />
              <Button
                size="small"
                backgroundColor={Colors.blue30}
                label="Flip"
                labelStyle={tailwind`text-white text-xs font-semibold`}
                onPress={toggleCameraPosition}
                style={tailwind`rounded-lg`}
              />
            </View>
          </View>
        </Card>
        {/* Camera Section */}
        {device ? (
          <View flex style={tailwind`flex-1 relative`}>
            <Camera
              ref={camera}
              device={device}
              isActive={true}
              style={tailwind`flex-1`}
              photo={true}
            />
            {/* Capture Button */}
            <View style={tailwind`absolute bottom-8 left-1/2 -ml-8`}>
              <TouchableOpacity
                center
                style={[
                  tailwind`w-16 h-16 rounded-full bg-white border-2 border-gray-300 items-center justify-center`,
                  {
                    borderColor: Colors.grey40,
                  },
                ]}
                onPress={onCapturePress}
                disabled={isProcessing}>
                {isProcessing ? (
                  <ActivityIndicator size="large" color={Colors.green30} />
                ) : (
                  <View
                    style={[
                      tailwind`w-12 h-12 rounded-full`,
                      {
                        backgroundColor: isProcessing
                          ? Colors.grey40
                          : Colors.red30,
                      },
                    ]}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View
            flex
            center
            style={[
              tailwind`flex-1 justify-center items-center`,
              {backgroundColor: theme.backgroundSecondary},
            ]}>
            <Text
              style={[
                tailwind`text-center text-base`,
                {color: theme.textSecondary},
              ]}>
              Camera not available
            </Text>
          </View>
        )}
        {/* Footer Status */}
        <Card
          style={tailwind`mx-4 mb-3 p-5 bg-black bg-opacity-80 rounded-2xl`}
          backgroundColor={Colors.rgba(Colors.black, 0.8)}
          borderRadius={BorderRadiuses.br20}>
          <View center style={tailwind`items-center`}>
            <Text white style={tailwind`text-white text-sm mb-2`}>
              Status: {isProcessing ? 'Processing...' : 'Ready'}
            </Text>
            <Badge
              label={`Recognition Mode: ${captureMode}`}
              backgroundColor={Colors.yellow30}
              style={tailwind`mb-3`}
            />
            {processingResults ? (
              <View center style={tailwind`items-center`}>
                <Text style={tailwind`text-green-500 text-xs text-center mb-4`}>
                  Last Result: {processingResults}
                </Text>
                <Button
                  backgroundColor={Colors.blue30}
                  label="Clear Results"
                  labelStyle={tailwind`text-white font-semibold`}
                  onPress={() => setProcessingResults('')}
                  style={tailwind`rounded-lg px-4 py-2`}
                />
              </View>
            ) : null}
          </View>
        </Card>
      </SafeAreaView>

      {/* Loading Overlay */}
      {isProcessing && (
        <LoaderScreen
          color={Colors.blue30}
          message="Processing receipt..."
          overlay
          backgroundColor={Colors.rgba(Colors.black, 0.7)}
        />
      )}
    </View>
  );
};

export default CameraScreen;
