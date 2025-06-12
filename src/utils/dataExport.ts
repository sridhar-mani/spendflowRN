import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform, Share} from 'react-native';
import RNFS from 'react-native-fs';
import DocumentPicker from '@react-native-documents/picker';

/**
 * Export all app data to a JSON file
 * @returns Promise that resolves with share result or error
 */
export const exportAllData = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    // Get all keys
    const keys = await AsyncStorage.getAllKeys();

    // Get all data from AsyncStorage
    const stores = await AsyncStorage.multiGet(keys); // Format data as a JSON object
    const exportData = {
      version: '1.0',
      date: new Date().toISOString(),
      data: {} as Record<string, any>,
    };

    // Add each store to the export data
    stores.forEach(([key, value]) => {
      if (value) {
        try {
          // Parse JSON values
          exportData.data[key] = JSON.parse(value);
        } catch {
          // If not JSON, store as plain string
          exportData.data[key] = value;
        }
      }
    });

    // Convert to JSON string
    const jsonData = JSON.stringify(exportData, null, 2);

    // Generate a file name with date
    const date = new Date();
    const fileName = `spendflow_backup_${date.getFullYear()}-${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}.json`;

    // On Android, write to file first, then share
    if (Platform.OS === 'android') {
      const path = `${RNFS.DownloadDirectoryPath}/${fileName}`;
      await RNFS.writeFile(path, jsonData, 'utf8');

      return {
        success: true,
        message: `Data exported successfully to Downloads folder as ${fileName}`,
      };
    }
    // On iOS, use Share API
    else {
      const path = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      await RNFS.writeFile(path, jsonData, 'utf8');

      // Share the file
      const shareResult = await Share.share({
        title: 'SpendFlow Backup',
        message: 'Your SpendFlow data backup',
        url: `file://${path}`,
      });

      if (shareResult.action === Share.sharedAction) {
        return {
          success: true,
          message: 'Data exported successfully',
        };
      } else {
        return {
          success: false,
          message: 'Export cancelled',
        };
      }
    }
  } catch (error: any) {
    console.error('Error exporting data:', error);
    return {
      success: false,
      message: `Error exporting data: ${error.message ?? 'Unknown error'}`,
    };
  }
};

/**
 * Import data from a JSON file
 * @returns Promise that resolves with import result or error
 */
export const importData = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    // Pick a file
    const result = await DocumentPicker.pick({
      type: [DocumentPicker.types.json],
    });

    // Get the first file (pick returns an array)
    const file = result[0];

    // Read the file
    const fileContent = await RNFS.readFile(file.uri, 'utf8');

    // Parse the JSON
    const importedData = JSON.parse(fileContent);

    // Validate that this is a SpendFlow backup
    if (!importedData.version || !importedData.data) {
      return {
        success: false,
        message: 'Invalid backup file format',
      };
    } // Store each key-value pair in AsyncStorage
    const stores = Object.entries(importedData.data);

    // Prepare data for AsyncStorage - ensure each entry is [string, string]
    const dataToStore: [string, string][] = stores.map(([key, value]) => [
      key,
      typeof value === 'string' ? value : JSON.stringify(value),
    ]);

    // Store all data
    await AsyncStorage.multiSet(dataToStore);

    return {
      success: true,
      message:
        'Data imported successfully! Please restart the app to see your data.',
    };
  } catch (error: any) {
    // User cancelled
    if (error?.code === 'DOCUMENT_PICKER_CANCELED') {
      return {
        success: false,
        message: 'Import cancelled',
      };
    }

    console.error('Error importing data:', error);
    return {
      success: false,
      message: `Error importing data: ${error.message ?? 'Unknown error'}`,
    };
  }
};
