import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProfileData } from '../types';

const PROFILE_KEY = '@ironpath_profile';
const XP_KEY = '@ironpath_xp';

export const saveProfile = async (profile: ProfileData) => {
  try {
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving profile', e);
  }
};

// THIS FUNCTION MUST EXIST
export const loadProfile = async (): Promise<ProfileData | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(PROFILE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Error loading profile', e);
    return null;
  }
};

export const saveXP = async (xp: number) => {
  try {
    await AsyncStorage.setItem(XP_KEY, JSON.stringify(xp));
  } catch (e) {
    console.error('Error saving XP', e);
  }
};

export const loadXP = async (): Promise<number> => {
  try {
    const jsonValue = await AsyncStorage.getItem(XP_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : 0;
  } catch (e) {
    console.error('Error loading XP', e);
    return 0;
  }
};
