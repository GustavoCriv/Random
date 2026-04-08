import AsyncStorage from '@react-native-async-storage/async-storage';
import { WorkoutLog, UserProfile } from '../types';

const STORAGE_KEYS = {
  USER_PROFILE: '@ironpath_profile',
  WORKOUT_LOGS: '@ironpath_workouts',
  XP_CACHE: '@ironpath_xp',
};

export const StorageService = {
  // --- User Profile ---
  async saveProfile(profile: UserProfile): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile', e);
    }
  },

  async getProfile(): Promise<UserProfile | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  // --- Workouts ---
  async saveWorkout(workout: WorkoutLog): Promise<void> {
    try {
      const existingData = await AsyncStorage.getItem(STORAGE_KEYS.WORKOUT_LOGS);
      const workouts: WorkoutLog[] = existingData ? JSON.parse(existingData) : [];
      
      // Add new workout to the beginning of the list
      workouts.unshift(workout);
      
      await AsyncStorage.setItem(STORAGE_KEYS.WORKOUT_LOGS, JSON.stringify(workouts));
    } catch (e) {
      console.error('Failed to save workout', e);
    }
  },

  async getWorkouts(): Promise<WorkoutLog[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.WORKOUT_LOGS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  // --- XP Cache (for instant UI updates) ---
  async addXP(amount: number): Promise<number> {
    try {
      const current = await AsyncStorage.getItem(STORAGE_KEYS.XP_CACHE);
      const newTotal = (current ? parseInt(current) : 0) + amount;
      await AsyncStorage.setItem(STORAGE_KEYS.XP_CACHE, newTotal.toString());
      return newTotal;
    } catch (e) {
      return 0;
    }
  },
  
  async getTotalXP(): Promise<number> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.XP_CACHE);
      return data ? parseInt(data) : 0;
    } catch (e) {
      return 0;
    }
  }
};
