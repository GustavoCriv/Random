import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProfileData, WorkoutLog } from '../types';

const STORAGE_KEYS = {
  PROFILE: '@ironpath_profile',
  WORKOUTS: '@ironpath_workouts',
  XP_CACHE: '@ironpath_xp',
};

export const saveProfile = async (profile: ProfileData): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (error) {
    console.error('Error saving profile:', error);
  }
};

export const loadProfile = async (): Promise<ProfileData | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.PROFILE);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading profile:', error);
    return null;
  }
};

export const saveWorkout = async (workout: WorkoutLog): Promise<void> => {
  try {
    const existingData = await AsyncStorage.getItem(STORAGE_KEYS.WORKOUTS);
    const workouts: WorkoutLog[] = existingData ? JSON.parse(existingData) : [];
    workouts.push(workout);
    await AsyncStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workouts));
  } catch (error) {
    console.error('Error saving workout:', error);
  }
};

export const loadWorkouts = async (): Promise<WorkoutLog[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.WORKOUTS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading workouts:', error);
    return [];
  }
};

export const clearStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};
