import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import IronMascot from '../src/components/Mascot';
import { RankTier } from '../src/types';

// --- MOCK DATA (Replaces Storage for Web Demo) ---
const MOCK_PROFILE = {
  name: 'Athlete',
  level: 5,
  xp: 1250,
  nextLevelXp: 2000,
  rank: 'Silver' as RankTier,
  streak: 3,
  bodyWeight: 80, // kg
};

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(MOCK_PROFILE);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading IronPath...</Text>
      </View>
    );
  }

  const xpProgress = (profile.xp / profile.nextLevelXp) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>IronPath</Text>
          <View style={[styles.rankBadge, { backgroundColor: getRankColor(profile.rank) }]}>
            <Text style={styles.rankText}>{profile.rank}</Text>
          </View>
        </View>

        {/* Mascot */}
        <IronMascot mood="excited" />

        {/* Stats Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Today's Progress</Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{profile.xp}</Text>
              <Text style={styles.statLabel}>Total XP</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>Lvl {profile.level}</Text>
              <Text style={styles.statLabel}>Level</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{profile.streak}🔥</Text>
              <Text style={styles.statLabel}>Streak</Text>
            </View>
          </View>
          
          {/* XP Bar */}
          <View style={styles.xpBarBg}>
            <View style={[styles.xpBarFill, { width: `${Math.min(xpProgress, 100)}%` }]} />
          </View>
          <Text style={styles.xpText}>{profile.xp} / {profile.nextLevelXp} XP to Lvl {profile.level + 1}</Text>
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
          <TouchableOpacity 
            style={styles.secondaryBtn}
            onPress={() => Alert.alert("Profile", "Profile settings coming soon!")}
          >
            <Text style={styles.secText}>Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>IronPath v1.0 • Web Demo</Text>
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
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F2F2F7' },
  loadingText: { marginTop: 10, color: '#8E8E93' },
  content: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingTop: 10 },
  title: { fontSize: 28, fontWeight: '900', color: '#1C1C1E' },
  rankBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  rankText: { color: '#FFF', fontWeight: 'bold', fontSize: 12, textShadowColor: 'rgba(0,0,0,0.2)', textShadowOffset: {width:0, height:1}, textShadowRadius: 1 },
  
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  stat: { alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '800', color: '#007AFF' },
  statLabel: { fontSize: 12, color: '#8E8E93', marginTop: 4 },
  
  card: { backgroundColor: '#FFF', padding: 20, borderRadius: 20, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  
  xpBarBg: { height: 12, backgroundColor: '#E5E5EA', borderRadius: 6, overflow: 'hidden', marginBottom: 8 },
  xpBarFill: { height: '100%', backgroundColor: '#34C759' },
  xpText: { fontSize: 12, color: '#8E8E93', textAlign: 'right', fontWeight: '600' },

  startButton: { backgroundColor: '#007AFF', padding: 20, borderRadius: 16, alignItems: 'center', marginBottom: 15, shadowColor: '#007AFF', shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  startButtonText: { color: '#FFF', fontSize: 18, fontWeight: '900', letterSpacing: 0.5 },

  row: { flexDirection: 'row', justifyContent: 'space-between' },
  secondaryBtn: { backgroundColor: '#FFF', flex: 0.48, padding: 15, borderRadius: 12, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  secText: { color: '#007AFF', fontWeight: '600', fontSize: 15 },

  footer: { marginTop: 30, alignItems: 'center' },
  footerText: { color: '#C7C7CC', fontSize: 12 },
});
