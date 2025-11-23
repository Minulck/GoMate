import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * A wrapper for AsyncStorage that handles null or undefined values by using removeItem instead of setItem.
 * This prevents issues on iOS where passing null or undefined to setItem can cause problems.
 */
export class AsyncStorageWrapper {
  static async setItem(
    key: string,
    value: string | null | undefined
  ): Promise<void> {
    if (value == null) {
      await AsyncStorage.removeItem(key);
    } else {
      await AsyncStorage.setItem(key, value);
    }
  }

  static async getItem(key: string): Promise<string | null> {
    return await AsyncStorage.getItem(key);
  }

  static async removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  }

  static async clear(): Promise<void> {
    await AsyncStorage.clear();
  }
}
