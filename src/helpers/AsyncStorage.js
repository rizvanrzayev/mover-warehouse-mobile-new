import AsyncStorage from '@react-native-community/async-storage';

const TOKEN_KEY = '@mover/token';

const writeItemToStorage = async (key, value) => {
  const currentValue = await AsyncStorage.getItem(key);
  let result;
  if (currentValue !== null) {
    try {
      result = await AsyncStorage.setItem(
        key,
        typeof value === 'object' ? JSON.stringify(value) : value,
      );
    } catch (error) {
      console.log(error);
    }
  } else {
    try {
      result = await AsyncStorage.mergeItem(
        key,
        typeof value === 'object' ? JSON.stringify(value) : value,
      );
    } catch (error) {
      console.log(error);
    }
  }
  return result;
};

export const readItemFromStorage = async (key) => {
  let result = await AsyncStorage.getItem(key);
  try {
    result = JSON.parse(result);
  } catch (e) {}
  return result;
};

export const getToken = async () => {
  const result = await readItemFromStorage(TOKEN_KEY);
  return result;
};

export const setToken = async (token) => {
  const result = await writeItemToStorage(TOKEN_KEY, token);
  return result;
};

export const removeToken = async () => {
  const result = await AsyncStorage.removeItem(TOKEN_KEY);
  return result;
};
