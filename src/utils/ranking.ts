export type RankTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Master' | 'Grandmaster' | 'Challenger' | 'Titan' | 'Olympian';

export const RANK_TIERS: RankTier[] = [
  'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 
  'Master', 'Grandmaster', 'Challenger', 'Titan', 'Olympian'
];

// Calculate 1 Rep Max (Epley Formula)
export const calculate1RM = (weight: number, reps: number): number => {
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30));
};

// Calculate Lift Points (LP) normalized by bodyweight
// Formula: (1RM / Bodyweight) * Coefficient
export const calculateLiftPoints = (oneRepMax: number, bodyWeight: number): number => {
  if (bodyWeight <= 0) return 0;
  const ratio = oneRepMax / bodyWeight;
  // Arbitrary coefficient to make numbers look nice (0-100 scale per tier)
  return Math.round(ratio * 50); 
};

export const getRankForLP = (totalLP: number): { tier: RankTier; progress: number; nextTierLP: number } => {
  const lpPerTier = 100;
  const totalTiers = RANK_TIERS.length;
  
  // Cap at Olympian
  const maxLP = totalTiers * lpPerTier;
  const cappedLP = Math.min(totalLP, maxLP);

  const tierIndex = Math.floor(cappedLP / lpPerTier);
  const currentTier = RANK_TIERS[Math.min(tierIndex, totalTiers - 1)];
  
  const progressInTier = cappedLP % lpPerTier;
  const nextTierLP = (tierIndex + 1) * lpPerTier;

  return {
    tier: currentTier,
    progress: progressInTier,
    nextTierLP: tierIndex >= totalTiers - 1 ? maxLP : nextTierLP
  };
};

export const calculateXP = (volume: number, isPR: boolean, streakBonus: number): number => {
  let xp = Math.round(volume / 10); // 10kg = 1 XP
  if (isPR) xp += 50; // Bonus for PR
  if (streakBonus > 0) xp += (streakBonus * 10);
  return xp;
};
