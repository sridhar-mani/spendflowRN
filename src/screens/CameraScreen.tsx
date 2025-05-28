import React, {useEffect, useRef} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  Camera,
  useCameraDevice,
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera';
import {runOnJS} from 'react-native-reanimated';
import tailwind from 'twrnc';
import TextRecognition from '@react-native-ml-kit/text-recognition';
import {Alert, Text} from 'react-native';
import {Button, Icon} from 'react-native-ui-lib';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import RNFS, {stat} from 'react-native-fs';
import {imageProcessoring} from '../utils/imagePreprocessing';
import {useTensorflowModel} from 'react-native-fast-tflite';

const CameraScreen = () => {
  const [hasPermission, setHasPermission] = React.useState(false);
  const [recognizedText, setRecognizedText] = React.useState('');
  const device = useCameraDevice('back');
  const cameraRef = useRef<Camera>(null);

  const craftModel = useTensorflowModel(
    require('../../assets/craft_model.tflite'),
    'default',
  );
  const yoloModel = useTensorflowModel(
    require('../../assets/yolov5nu.tflite'),
    'android-gpu',
  );
  const modelRef = useRef<any>(null);

  const prcoessImage = async imgPath => {
    try {
      console.log('imageProcessoring =', imageProcessoring);
      const resCraft = await imageProcessoring({
        imagePath: imgPath,
        model: 'CRAFT',
      });

      const outCraft = modelRef.current.craftModel.model.run(resCraft?.tensor);

      console.log(outCraft);

      const resYolo = await imageProcessoring({
        imagePath: imgPath,
        model: 'YOLO',
      });

      console.log(resYolo, resCraft);
    } catch (e) {
      console.error('Error processing image for craft model', e);
    }
  };

  useEffect(() => {
    const requestCameraPerm = async () => {
      console.log('sdf');

      const state = await Camera.requestCameraPermission();
      console.log('Permission state:', state);
      if (state === 'denied') {
        Alert.alert(
          'Camera Permission',
          'Camera access is required to scan receipts.',
        );
      }

      if (state === 'granted') {
        try {
          // const result = await init_models();
          // if (result !== undefined) {
          //   modelRef.current = result;
          // }
        } catch (er) {
          console.error('Error initializing models', er);
        }
      }

      setHasPermission(state === 'granted');
    };

    requestCameraPerm();
    return () => {
      if (modelRef.current) {
        modelRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (craftModel && yoloModel) {
      modelRef.current = {
        craftModel,
        yoloModel,
      };
      console.log('Models loaded');
    }
  }, [craftModel, yoloModel]);

  const procesImage = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePhoto({
        enableAutoDistortionCorrection: true,
      });

      console.log(photo.path);
      const res = await prcoessImage(photo.path);
      const result = await TextRecognition.recognize('file://' + photo.path);

      console.log(res);
      await RNFS.unlink(photo.path);
    } catch (er) {
      console.error('Unable to process image', er);
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      {device ? (
        <Camera
          device={device}
          isActive={true}
          photo={true}
          style={{flex: 1}}
          photoHdr={true}
          focusable={true}
          photoQualityBalance="quality"
          ref={cameraRef}
          // frameProcessor={frameProcessor} // Temporarily disabled
        />
      ) : (
        <Text style={{textAlign: 'center', marginTop: 20}}>
          Camera not available
        </Text>
      )}
      {hasPermission && (
        <Button
          iconSource={iconStyle => (
            <FontAwesome
              name="camera"
              size={20}
              color="white"
              style={iconStyle}
            />
          )}
          iconStyle={tailwind`bg-blue-500 rounded-full p-5`}
          style={[
            tailwind`absolute bottom-3`,
            {left: '55%', transform: [{translateX: -50}]},
          ]}
          backgroundColor="blue"
          onPress={procesImage}
        />
      )}
    </SafeAreaView>
  );
};

export default CameraScreen;
