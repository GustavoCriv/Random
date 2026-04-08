import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { supabase } from '../src/lib/supabase';
import { loadProfile, saveProfile } from '../src/lib/storage';
import Mascot from '../src/components/Mascot';
import { getRankForLP, calculateXP } from '../src/utils/ranking';
import { Profile } from '../src/types';

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [rankInfo, setRankInfo] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Try local storage first (Offline-first)
    const localData = await loadProfile();
    if (localData) {
      setProfile(localData);
      setRankInfo(getRankForLP(localData.liftPoints));
      setLoading(false);
      return;
    }

    // Fallback to Supabase if no local data
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (data && !error) {
        setProfile(data);
        setRankInfo(getRankForLP(data.lift_points || 0));
        await saveProfile(data); // Cache locally
      }
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.center}><ActivityIndicator size="large" color="#007AFF" /></View>
    );
  }

  if (!profile) {
    // If no profile, redirect to onboarding (mocked here)
    return (
      <View style={styles.center}>
        <Text>No profile found. Please complete onboarding.</Text>
        <TouchableOpacity style={styles.btn} onPress={() => router.push('/onboarding' as any)}>
          <Text style={styles.btnText}>Start Onboarding</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const xpProgress = rankInfo ? (rankInfo.progress / 100) * 100 : 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>IronPath</Text>
          <View style={[styles.rankBadge, { backgroundColor: getRankColor(rankInfo?.tier) }]}>
            <Text style={styles.rankText}>{rankInfo?.tier}</Text>
          </View>
        </View>

        {/* Mascot */}
        <Mascot mood="happy" message={`Welcome back, ${profile.username || 'Athlete'}! Ready to crush it?`} />

        {/* Stats Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Progress</Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{profile.liftPoints || 0}</Text>
              <Text style={styles.statLabel}>Lift Points</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{profile.level || 1}</Text>
              <Text style={styles.statLabel}>Level</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{profile.streak || 0}🔥</Text>
              <Text style={styles.statLabel}>Streak</Text>
            </View>
          </View>
          
          {/* XP Bar */}
          <View style={styles.xpContainer}>
            <Text style={styles.xpLabel}>Progress to {rankInfo?.nextTierLP === rankInfo?.progress ? 'Max Rank' : 'Next Tier'}:</Text>
            <View style={styles.xpBarBg}>
              <View style={[styles.xpBarFill, { width: `${xpProgress}%` }]} />
            </View>
            <Text style={styles.xpSub}>{rankInfo?.progress} / 100 LP</Text>
          </View>
        </View>

        {/* Main Action */}
        <TouchableOpacity 
          style={styles.startButton}
          onPress={() => router.push('/workout' as any)}
        >
          <Text style={styles.startButtonText}>START WORKOUT</Text>
        </TouchableOpacity>

        {/* Navigation Grid */}
        <View style={styles.grid}>
          <TouchableOpacity style={styles.gridItem} onPress={() => router.push('/leaderboard' as any)}>
            <Text style={styles.gridIcon}>🏆</Text>
            <Text style={styles.gridText}>Leaderboard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridItem} onPress={() => Alert.alert("Profile", "Profile settings coming soon")}>
            <Text style={styles.gridIcon}>👤</Text>
            <Text style={styles.gridText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridItem} onPress={() => Alert.alert("History", "Workout history coming soon")}>
            <Text style={styles.gridIcon}>📅</Text>
            <Text style={styles.gridText}>History</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridItem} onPress={() => Alert.alert("Settings", "Settings coming soon")}>
            <Text style={styles.gridIcon}>⚙️</Text>
            <Text style={styles.gridText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getRankColor = (tier: string) => {
  switch(tier) {
    case 'Gold': return '#FFD700';
    case 'Silver': return '#C0C0C0';
    case 'Bronze': return '#CD7F32';
    case 'Platinum': return '#E5E4E2';
    case 'Diamond': return '#B9F2FF';
    default: return '#8E8E93';
  }
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 28, fontWeight: '900', color: '#1C1C1E' },
  rankBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15 },
  rankText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  
  card: { backgroundColor: '#FFF', padding: 20, borderRadius: 20, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  stat: { alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '800', color: '#007AFF' },
  statLabel: { fontSize: 12, color: '#8E8E93' },
  
  xpContainer: { marginTop: 10 },
  xpLabel: { fontSize: 12, color: '#666', marginBottom: 5 },
  xpBarBg: { height: 12, backgroundColor: '#E5E5EA', borderRadius: 6, overflow: 'hidden' },
  xpBarFill: { height: '100%', backgroundColor: '#34C759' },
  xpSub: { fontSize: 11, color: '#8E8E93', textAlign: 'right', marginTop: 4 },

  startButton: { backgroundColor: '#007AFF', padding: 20, borderRadius: 16, alignItems: 'center', marginBottom: 20, shadowColor: '#007AFF', shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  startButtonText: { color: '#FFF', fontSize: 18, fontWeight: '900' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem: { width: '48%', backgroundColor: '#FFF', padding: 15, borderRadius: 12, marginBottom: 10, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.03, elevation: 2 },
  gridIcon: { fontSize: 24, marginBottom: 5 },
  gridText: { color: '#333', fontWeight: '600' },
  btn: { marginTop: 20, backgroundColor: '#007AFF', padding: 15, borderRadius: 10 },
  btnText: { color: '#FFF', fontWeight: 'bold' }
});
