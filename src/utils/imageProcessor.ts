import ImageResizer from '@bam.tech/react-native-image-resizer';
import RNFS from 'react-native-fs';
import getImage from 'react-native-pixel-image';

import {spawnThread} from 'react-native-multithreading';

const imageProcessoring = async (message)=> {

  const {imagePath, model} = message;

  if(model === 'CRAFT'){
    const tensor = await preprocessForCRAFT(imagePath);
    const isValid = await validateTensor(tensor, [1, 3, 768, 768]);
    if(isValid){
      return {tensor, msg: 'Tensor is valid'};
    }else{
      return {msg: 'Invalid tensor shape for CRAFT model'};
    }
  }
  if(model === 'YOLO'){
    const tensor = await preprocessForYOLO(imagePath);
    const isValid = await validateTensor(tensor, [1, 3, 640, 640]);
    if(isValid){
      return {tensor,msg: 'Tensor is valid'};
    }else{
      return {msg: 'Invalid tensor shape for CRAFT model'};
    }
  }

   async function imageToFloat32Array(
    imagepath: string,
    targetWidth: number,
    targetHeight: number,
    normalize = true,
    channelsOrder = 'CHW',
  ) {
    try {

      

      const resizedImage = await ImageResizer.createResizedImage(
        imagepath,
        targetWidth,
        targetHeight,
        'PNG',
        100,
        0,
        null,
        true,
        {
          mode: 'contain',
          onlyScaleDown: false,
        },
      );

      const pixelData = await extractPixelData(
        resizedImage.uri,
        targetWidth,
        targetHeight,
      );
      const tensor = await spawnThread(async ()=>{
        const responce = await imageDataToTensor(
        pixelData,
        targetWidth,
        targetHeight,
        normalize,
        channelsOrder,
      )
      return responce;
      })
      if (resizedImage.uri.startsWith('file://')) {
        await RNFS.unlink(resizedImage.uri.replace('file://', ''));
      }

      return tensor;
    } catch (er) {
      console.error('Error converting image to float32 array', er);
    }
  }

   async function imageDataToTensor(
    imageData: Uint8ClampedArray,
    targetWidth: number,
    targetHeight: number,
    normalize = true,
    channelsOrder = 'CHW',
  ) {
    const channels = 3;
    const totalPixels = targetWidth * targetHeight * channels;
    const tensor = new Float32Array(totalPixels);

    if (channelsOrder === 'CHW') {
      let tensorIndex = 0;

      for (let i = 0; i < imageData.length; i += 4) {
        tensor[tensorIndex++] = normalize ? imageData[i] / 255.0 : imageData[i];
      }

      for (let i = 1; i < imageData.length; i += 4) {
        tensor[tensorIndex++] = normalize ? imageData[i] / 255.0 : imageData[i];
      }

      for (let i = 2; i < imageData.length; i += 4) {
        tensor[tensorIndex++] = normalize ? imageData[i] / 255.0 : imageData[i];
      }
    } else {
      let tensorIndex = 0;
      for (let i = 0; i < imageData.length; i += 4) {
        tensor[tensorIndex++] = normalize ? imageData[i] / 255.0 : imageData[i];
        tensor[tensorIndex++] = normalize
          ? imageData[i + 1] / 255.0
          : imageData[i + 1];
        tensor[tensorIndex++] = normalize
          ? imageData[i + 2] / 255.0
          : imageData[i + 2];
      }
    }

    return tensor;
  }

   async function extractPixelData(imageUri: string, width: number, height: number) {
    try {
      const pixelData = await getImage(imageUri);
      return pixelData.data instanceof Uint8ClampedArray ? pixelData.data : new Uint8ClampedArray(pixelData.data);
    } catch (e) {
      console.error('Error extracting pixel data', e);
    }
  }

   async function preprocessForCRAFT(imagePathh: string) {
    return await imageToFloat32Array(imagePathh, 768, 768, true, 'CHW');
  }

  async function preprocessForYOLO(imagePathh: string) {
    return await imageToFloat32Array(imagePathh, 640, 640, true, 'CHW');
  }

   async function validateTensor(tensor, expectedShape) {
    const expectedSize = expectedShape.reduce((a, b) => a * b, 1);
    if (tensor.length !== expectedSize) {
      throw new Error(
        `Tensor size mismatch: expected ${expectedSize}, got ${tensor.length}`,
      );
    }

    console.log('Tensor shape is valid');
    return true;
  }
}


export {imageProcessoring};