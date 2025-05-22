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
import RNFS from 'react-native-fs';

const CameraScreen = () => {
  const [hasPermission, setHasPermission] = React.useState(false);
  const [recognizedText, setRecognizedText] = React.useState('');
  const device = useCameraDevice('back');
  const cameraRef = useRef<Camera>(null);
  console.log(device);

  useEffect(() => {
    const requestCameraPerm = async () => {
      const state = await Camera.requestCameraPermission();
      if (state === 'denied') {
        Alert.alert(
          'Camera Permission',
          'Camera access is required to scan receipts.',
        );
      }

      setHasPermission(state === 'granted');
    };
    requestCameraPerm();
  }, []);

  const procesImage = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePhoto({
        enableAutoDistortionCorrection: true,
      });

      console.log(photo.path);
      const result = await TextRecognition.recognize('file://' + photo.path);

      console.log(result);
      await RNFS.unlink(photo.path);
    } catch (er) {
      console.error('Unable to process image', er);
    }
  };

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
