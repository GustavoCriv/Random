import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RankTier, getRankForLP, calculateLiftPoints, calculate1RM } from '../src/utils/ranking';

// --- INTERNAL STORAGE HELPER (Bypasses the broken external file) ---
const PROFILE_KEY = '@ironpath_profile';

const loadProfileInternal = async () => {
  try {
    // If running on Web and AsyncStorage fails, we catch it and return null
    const jsonValue = await AsyncStorage.getItem(PROFILE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.warn("Storage not available (Web or Error), using defaults:", e);
    return null;
  }
};

// --- THE MASCOT COMPONENT ---
const IronMascot = ({ mood }: { mood: 'happy' | 'excited' | 'neutral' }) => {
  const getColor = () => {
    if (mood === 'excited') return '#FFD700'; 
    if (mood === 'happy') return '#34C759';   
    return '#8E8E93';                         
  };

  return (
    <View style={styles.mascotContainer}>
      <View style={[styles.mascotHead, { backgroundColor: getColor() }]}>
        <View style={styles.eye} />
        <View style={styles.eye} />
        <Text style={styles.mouth}>{mood === 'neutral' ? '😐' : '😁'}</Text>
      </View>
      <View style={styles.speechBubble}>
        <Text style={styles.speechText}>
          {mood === 'excited' ? "Let's hit a PR today!" : "Ready to train?"}
        </Text>
      </View>
    </View>
  );
};

// --- MAIN DASHBOARD ---
export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [rank, setRank] = useState<RankTier>('Bronze');
  const [bodyWeight, setBodyWeight] = useState(80); // Default 80kg

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Try to load from storage, but don't crash if it fails
      const profile = await loadProfileInternal();
      
      if (profile) {
        setXp(profile.xp || 0);
        setBodyWeight(profile.bodyWeight || 80);
        // Calculate rank based on saved data
        const totalLP = calculateLiftPoints(profile.totalVolume || 0, profile.bodyWeight || 80);
        const rankData = getRankForLP(totalLP);
        setRank(rankData.tier);
        setLevel(Math.floor((profile.xp || 0) / 1000) + 1);
      } else {
        // Default Mock Data for first time users
        setXp(1250);
        setLevel(2);
        setRank('Silver');
      }
    } catch (error) {
      console.error("Failed to load data", error);
      // Fallback to defaults on error
      setXp(1250);
      setLevel(2);
      setRank('Silver');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading IronPath...</Text>
      </View>
    );
  }

  const progressToNextLevel = (xp % 1000) / 10; // Simplified for demo

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>IronPath</Text>
          <View style={[styles.rankBadge, { backgroundColor: getRankColor(rank) }]}>
            <Text style={styles.rankText}>{rank}</Text>
          </View>
        </View>

        {/* Mascot Area */}
        <IronMascot mood="excited" />

        {/* Stats Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Today's Progress</Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{xp}</Text>
              <Text style={styles.statLabel}>Total XP</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>Lvl {level}</Text>
              <Text style={styles.statLabel}>Level</Text>
            </View>
          </View>
          
          {/* XP Bar */}
          <View style={styles.xpBarBg}>
            <View style={[styles.xpBarFill, { width: `${progressToNextLevel}%` }]} />
          </View>
          <Text style={styles.xpText}>{Math.round(progressToNextLevel * 10)} / 1000 XP to Level {level + 1}</Text>
        </View>

        {/* Main Action */}
        <Link href="/workout" asChild>
          <TouchableOpacity style={styles.startButton}>
            <Text style={styles.startButtonText}>START WORKOUT</Text>
          </TouchableOpacity>
        </Link>

        {/* Secondary Actions */}
        <View style={styles.row}>
          <Link href="/leaderboard" asChild>
            <TouchableOpacity style={styles.secondaryBtn}>
              <Text style={styles.secText}>Leaderboard</Text>
            </TouchableOpacity>
          </Link>
          <TouchableOpacity style={styles.secondaryBtn} onPress={() => Alert.alert("Profile", "Profile settings coming soon!")}>
            <Text style={styles.secText}>Profile</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// Helper for rank colors
const getRankColor = (rank: string) => {
  switch(rank) {
    case 'Gold': return '#FFD700';
    case 'Silver': return '#C0C0C0';
    case 'Bronze': return '#CD7F32';
    case 'Platinum': return '#E5E4E2';
    case 'Diamond': return '#B9F2FF';
    default: return '#8E8E93';
  }
};

// --- STYLES ---
const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F2F2F7' },
  loadingText: { marginTop: 10, color: '#8E8E93' },
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  content: { padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 28, fontWeight: '900', color: '#1C1C1E' },
  rankBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15 },
  rankText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  
  mascotContainer: { alignItems: 'center', marginBottom: 25 },
  mascotHead: { width: 90, height: 90, borderRadius: 45, justifyContent: 'center', alignItems: 'center', marginBottom: 10, borderWidth: 4, borderColor: '#FFF' },
  eye: { width: 10, height: 10, backgroundColor: '#000', borderRadius: 5, position: 'absolute', top: 30 },
  mouth: { marginTop: 35, fontSize: 24 },
  speechBubble: { backgroundColor: '#FFF', padding: 12, borderRadius: 20, borderWidth: 1, borderColor: '#DDD', elevation: 2 },
  speechText: { fontSize: 14, color: '#333', textAlign: 'center', fontWeight: '600' },

  card: { backgroundColor: '#FFF', padding: 20, borderRadius: 20, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 15 },
  stat: { alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: '800', color: '#007AFF' },
  statLabel: { fontSize: 12, color: '#8E8E93' },
  
  xpBarBg: { height: 12, backgroundColor: '#E5E5EA', borderRadius: 6, overflow: 'hidden', marginBottom: 5 },
  xpBarFill: { height: '100%', backgroundColor: '#34C759' },
  xpText: { fontSize: 12, color: '#8E8E93', textAlign: 'right' },

  startButton: { backgroundColor: '#007AFF', padding: 20, borderRadius: 16, alignItems: 'center', marginBottom: 15, shadowColor: '#007AFF', shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  startButtonText: { color: '#FFF', fontSize: 18, fontWeight: '900' },

  row: { flexDirection: 'row', justifyContent: 'space-between' },
  secondaryBtn: { backgroundColor: '#FFF', flex: 0.48, padding: 15, borderRadius: 12, alignItems: 'center' },
  secText: { color: '#007AFF', fontWeight: '600' },
});
