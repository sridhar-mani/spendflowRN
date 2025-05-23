import ImageResizer from '@bam.tech/react-native-image-resizer';
import RNFS from 'react-native-fs';

class ImageProcessor {
  async imageToFloat32Array(
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

      const pixelData = await this.extractPixelData(
        resizedImage.uri,
        targetWidth,
        targetHeight,
      );
      const tensor = this.imageDataToTensor(
        pixelData,
        targetWidth,
        targetHeight,
        normalize,
        channelsOrder,
      );
      if (resizedImage.uri.startsWith('file://')) {
        await RNFS.unlink(resizedImage.uri.replace('file://', ''));
      }

      return tensor;
    } catch (er) {
      console.error('Error converting image to float32 array', er);
    }
  }

  async base64ToImageData() {
    return 'test';
  }

  async imageDataToTensor(
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

  async extractPixelData(imageUri: string, width: number, height: number) {
    try {
      const base64Ff = await RNFS.readFile(imageUri, 'base64');

      return new Promise((resolve, reject) => {
        const image = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = width;
        canvas.height = height;
        image.onload = () => {
          try {
            ctx.drawImage(image, 0, 0, width, height);

            const imageData = ctx.getImageData(0, 0, width, height);
            resolve(imageData.data);
          } catch (e) {
            console.error('Error processing image', e);
            reject(e);
          }
        };
        image.onerror = reject;
        image.src = `data:iamge/png;base64,${base64Ff}`;
      });
    } catch (e) {
      console.error('Error extracting pixel data', e);
    }
  }

  async preprocessForCRAFT(imagePath: string) {
    return this.imageToFloat32Array(imagePath, 768, 768, true, 'CHW');
  }

  async preprocessForYOLO(imagePath: string) {
    return this.imageToFloat32Array(imagePath, 640, 640, true, 'CHW');
  }

  async validateTensor(tensor, expectedShape) {
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
