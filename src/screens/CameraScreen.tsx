import React, {useEffect} from 'react';
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

const CameraScreen = () => {
  const [hasPermission, setHasPermission] = React.useState(false);
  const devices = useCameraDevice('back');
  console.log(devices);

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
      setHasPermission(state === 'granted');
    };

    requestCameraPerm();
    return () => {
      if (modelRef.current) {
        modelRef.current = null;
      }
    };
  }, []);
  // Temporarily disabled frame processor due to Android build issues
  // const frameProcessor = useFrameProcessor(frame => {
  //   'worklet';
  //   runOnJS(processFrame)(frame);
  // }, []);

  // const processFrame = async frame => {
  //   try {
  //     const {blocks} = await TextRecognition.recognize(frame);
  //     const lines = blocks.flatMap(b => b.lines.map(l => l.text));
  //     console.log('Detected lines:', lines);
  //   } catch (e) {
  //     console.warn('Error processing frame: ', e);
  //   }
  // };
  return (
    <SafeAreaView style={{flex: 1}}>
      {devices ? (
        <Camera
          device={devices}
          isActive={true}
          style={{flex: 1}}
          // frameProcessor={frameProcessor} // Temporarily disabled
        />
      ) : (
        <Text style={{textAlign: 'center', marginTop: 20}}>
          Camera not available
        </Text>
      )}
    </SafeAreaView>
  );
};

export default CameraScreen;
