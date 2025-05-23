import {Platform} from 'react-native';
import * as FastTFLite from 'react-native-fast-tflite';

async function init_models() {
  try {
    const craftModel = async () => {
      try {
        return await FastTFLite.loadTensorflowModel(
          require('../../assets/craft_model.tflite'),
          'android-gpu',
        );
      } catch (e) {
        console.log(
          'Error loading CRAFT model with gpu. Falling back to cpu:',
          e,
        );
        return await FastTFLite.loadTensorflowModel(
          require('../../assets/craft_model.tflite'),
          'default',
        );
      }
    };

    const textRecognitionModel = async () => {
      try {
        return await FastTFLite.loadTensorflowModel(
          require('../../assets/yolov5nu.tflite'),
          'android-gpu',
        );
      } catch (e) {
        console.log(
          'Error loading Yolov model with gpu. Falling back to cpu:',
          e,
        );
        return await FastTFLite.loadTensorflowModel(
          require('../../assets/yolov5nu.tflite'),
          'default',
        );
      }
    };

    const craftModelDelegate = await craftModel();
    const textRecognitionModelDelegate = await textRecognitionModel();
    console.log('CRAFT Model loaded successfully');
    console.log('Text Recognition Model loaded successfully');
    console.log('CRAFT Model Delegate:', craftModelDelegate);
    console.log(
      'Text Recognition Model Delegate:',
      textRecognitionModelDelegate,
    );

    return {craftModelDelegate, textRecognitionModelDelegate};
  } catch (er) {
    console.error('Error loding mnodel', er);
  }
}

export {init_models};
