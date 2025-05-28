import RNFS from 'react-native-fs';
import {spawnThread} from 'react-native-multithreading';
import getImage from 'react-native-pixel-image';
import ImageResizer from '@bam.tech/react-native-image-resizer';

const imageProcessoring = async message => {
  const {imagePath, model} = message;

  try {
    let tensor;
    let expectedShape;

    if (model === 'CRAFT') {
      tensor = await preprocessForCRAFT(imagePath);
      expectedShape = [1, 3, 768, 768];
    } else if (model === 'YOLO') {
      tensor = await preprocessForYOLO(imagePath);
      expectedShape = [1, 3, 640, 640];
    } else {
      return {msg: `Unknown model type: ${model}`};
    }

    if (!tensor) {
      return {msg: `Tensor generation failed for ${model}`};
    }

    try {
      await validateTensor(tensor, expectedShape);
      return {tensor, msg: 'Tensor is valid'};
    } catch (err) {
      return {msg: `Invalid tensor shape for ${model}: ${err}`};
    }
  } catch (err) {
    console.error(`Error in imageProcessoring for ${model}:`, err);
    return {msg: `Error processing image for ${model}`};
  }

  // Utility Functions
  async function imageToFloat32Array(
    imagepath,
    targetWidth,
    targetHeight,
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
        {mode: 'contain', onlyScaleDown: false},
      );

      if (!resizedImage?.uri) {
        throw new Error('Failed to resize image.');
      }

      const pixelData = await extractPixelData(
        resizedImage.uri,
        targetWidth,
        targetHeight,
      );
      if (!pixelData || !(pixelData instanceof Uint8ClampedArray)) {
        throw new Error('Invalid pixel data');
      }

      const tensor = await spawnThread(async () => {
        async function imageDataToTensor(
          imageData,
          width,
          height,
          normalize,
          channelsOrder,
        ) {
          const channels = 3;
          const totalPixels = width * height * channels;
          const tensor = new Float32Array(totalPixels);

          if (channelsOrder === 'CHW') {
            let i = 0;
            for (let c = 0; c < 3; c++) {
              for (let j = c; j < imageData.length; j += 4) {
                tensor[i++] = normalize ? imageData[j] / 255.0 : imageData[j];
              }
            }
          } else {
            let i = 0;
            for (let j = 0; j < imageData.length; j += 4) {
              tensor[i++] = normalize ? imageData[j] / 255.0 : imageData[j];
              tensor[i++] = normalize
                ? imageData[j + 1] / 255.0
                : imageData[j + 1];
              tensor[i++] = normalize
                ? imageData[j + 2] / 255.0
                : imageData[j + 2];
            }
          }

          return tensor;
        }

        return await imageDataToTensor(
          pixelData,
          targetWidth,
          targetHeight,
          normalize,
          channelsOrder,
        );
      });

      if (resizedImage.uri.startsWith('file://')) {
        await RNFS.unlink(resizedImage.uri.replace('file://', ''));
      }

      return tensor;
    } catch (err) {
      console.error('Error converting image to float32 array:', err);
      return null;
    }
  }

  async function extractPixelData(imageUri, width, height) {
    try {
      const pixelData = await getImage(imageUri);
      return pixelData?.data instanceof Uint8ClampedArray
        ? pixelData.data
        : new Uint8ClampedArray(pixelData.data);
    } catch (e) {
      console.error('Error extracting pixel data', e);
      return null;
    }
  }

  async function preprocessForCRAFT(imagePath) {
    return await imageToFloat32Array(imagePath, 768, 768, true, 'CHW');
  }

  async function preprocessForYOLO(imagePath) {
    return await imageToFloat32Array(imagePath, 640, 640, true, 'CHW');
  }

  async function validateTensor(tensor, expectedShape) {
    const expectedSize = expectedShape.reduce((a, b) => a * b, 1);
    if (!tensor || tensor.length !== expectedSize) {
      throw new Error(
        `Tensor size mismatch: expected ${expectedSize}, got ${tensor?.length}`,
      );
    }
    return true;
  }
};

export {imageProcessoring};
