import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';

// --- MOCK DATA (No Database needed for now) ---
const MOCK_USER = {
  name: "Athlete",
  level: 5,
  xp: 1250,
  nextLevelXp: 2000,
  rank: "Silver",
  streak: 12,
  bodyWeight: 80, // kg
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
        {/* Eyes */}
        <View style={[styles.eye, { left: 20 }]} />
        <View style={[styles.eye, { right: 20 }]} />
        {/* Mouth */}
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
  // We use Mock Data directly. No loading functions.
  const user = MOCK_USER;
  const xpPercent = (user.xp / user.nextLevelXp) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>IronPath</Text>
          <View style={[styles.rankBadge, { backgroundColor: user.rank === 'Gold' ? '#FFD700' : '#C0C0C0' }]}>
            <Text style={styles.rankText}>{user.rank}</Text>
          </View>
        </View>

        {/* Mascot Area */}
        <IronMascot mood="excited" />

        {/* Stats Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Today's Progress</Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{user.xp}</Text>
              <Text style={styles.statLabel}>Total XP</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>Lvl {user.level}</Text>
              <Text style={styles.statLabel}>Level</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{user.streak}🔥</Text>
              <Text style={styles.statLabel}>Streak</Text>
            </View>
          </View>
          
          {/* XP Bar */}
          <View style={styles.xpBarBg}>
            <View style={[styles.xpBarFill, { width: `${Math.min(xpPercent, 100)}%` }]} />
          </View>
          <Text style={styles.xpText}>{user.xp} / {user.nextLevelXp} XP to Level {user.level + 1}</Text>
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
            onPress={() => Alert.alert("Profile", `Bodyweight: ${user.bodyWeight}kg\nGoal: Strength`)}
          >
            <Text style={styles.secText}>Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  content: { padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, marginTop: 10 },
  title: { fontSize: 28, fontWeight: '900', color: '#1C1C1E' },
  rankBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 },
  rankText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  
  mascotContainer: { alignItems: 'center', marginBottom: 25 },
  mascotHead: { width: 90, height: 90, borderRadius: 45, justifyContent: 'center', alignItems: 'center', marginBottom: 10, borderWidth: 4, borderColor: '#FFF', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5, position: 'relative' },
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
  secondaryBtn: { backgroundColor: '#FFF', flex: 0.48, padding: 15, borderRadius: 12, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  secText: { color: '#007AFF', fontWeight: '600' },
});
