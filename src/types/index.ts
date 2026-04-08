export type RankTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Master' | 'Grandmaster' | 'Challenger' | 'Titan' | 'Olympian';

export type Goal = 'strength' | 'hypertrophy' | 'fat_loss' | 'general';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
export type TrainingType = 'gym' | 'home' | 'bodyweight';

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  goal: Goal;
  experience: ExperienceLevel;
  trainingType: TrainingType;
  daysPerWeek: number;
  bodyWeight?: number; // kg
  height?: number; // cm
  createdAt: string;
}

export interface Exercise {
  id: string;
  name: string;
  category: string;
  equipment?: string;
}

export interface WorkoutSet {
  id: string;
  exerciseId: string;
  exerciseName: string;
  weight: number; // kg
  reps: number;
  rpe?: number;
  completed: boolean;
}

export interface WorkoutSession {
  id: string;
  userId: string;
  date: string;
  durationSeconds: number;
  sets: WorkoutSet[];
  totalVolume: number;
  xpEarned: number;
  isPR: boolean;
  notes?: string;
}

export interface UserStats {
  userId: string;
  totalXP: number;
  level: number;
  currentStreak: number;
  bestStreak: number;
  totalWorkouts: number;
  totalVolume: number; // lifetime kg
  liftPoints: number;
  currentRank: RankTier;
  rankProgress: number; // 0-100 within current tier
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  rank: RankTier;
  liftPoints: number;
  weeklyVolume: number;
  avatarColor?: string;
}
