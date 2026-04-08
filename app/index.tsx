import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../src/lib/supabase';

const Mascot = ({ mood }: { mood: 'happy' | 'neutral' | 'excited' }) => {
  const color = mood === 'excited' ? '#FFD700' : mood === 'happy' ? '#4CD964' : '#8E8E93';
  return (
    <View style={[styles.mascotContainer, { borderColor: color }]}>
      <View style={[styles.mascotBody, { backgroundColor: color }]}>
        <View style={styles.mascotEye} />
        <View style={styles.mascotEye} />
        <Text style={styles.mascotMouth}>{mood === 'happy' ? '😊' : '😐'}</Text>
      </View>
      <View style={styles.speechBubble}>
        <Text style={styles.speechText}>
          {mood === 'excited' ? "Let's crush this workout!" : "Ready to train?"}
        </Text>
      </View>
    </View>
  );
};

export default function Dashboard() {
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [rank, setRank] = useState('Bronze');

  useEffect(() => {
    console.log("Dashboard loaded");
  }, []);

  const handleStartWorkout = () => {
    Alert.alert("Start Workout", "Navigating to workout logger...");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>IronPath</Text>
          <View style={styles.rankBadge}>
            <Text style={styles.rankText}>{rank}</Text>
          </View>
        </View>

        <Mascot mood="excited" />

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Today's Progress</Text>
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{xp} XP</Text>
              <Text style={styles.statLabel}>Total XP</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>Lvl {level}</Text>
              <Text style={styles.statLabel}>Level</Text>
            </View>
          </View>
          
          <View style={styles.xpBarContainer}>
            <View style={[styles.xpBarFill, { width: '45%' }]} />
          </View>
          <Text style={styles.xpLabel}>450 / 1000 XP to next level</Text>
        </View>

        <TouchableOpacity style={styles.startButton} onPress={handleStartWorkout}>
          <Text style={styles.startButtonText}>START WORKOUT</Text>
        </TouchableOpacity>

        <View style={styles.linksRow}>
          <TouchableOpacity style={styles.linkButton}>
            <Text style={styles.linkText}>Leaderboard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkButton}>
            <Text style={styles.linkText}>Profile</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F7' },
  scrollContent: { padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 28, fontWeight: '800', color: '#1C1C1E' },
  rankBadge: { backgroundColor: '#CD7F32', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  rankText: { color: '#FFF', fontWeight: 'bold' },
  
  mascotContainer: { alignItems: 'center', marginBottom: 20, borderWidth: 2, borderRadius: 20, padding: 10, backgroundColor: '#FFF' },
  mascotBody: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  mascotEye: { width: 8, height: 8, backgroundColor: '#000', borderRadius: 4, marginHorizontal: 10, position: 'absolute', top: 25 },
  mascotMouth: { marginTop: 35, fontSize: 20 },
  speechBubble: { backgroundColor: '#FFF', padding: 10, borderRadius: 15, borderWidth: 1, borderColor: '#DDD', elevation: 2 },
  speechText: { fontSize: 14, color: '#333', textAlign: 'center' },

  card: { backgroundColor: '#FFF', padding: 20, borderRadius: 20, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  statRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 15 },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '800', color: '#007AFF' },
  statLabel: { fontSize: 12, color: '#8E8E93' },
  
  xpBarContainer: { height: 10, backgroundColor: '#E5E5EA', borderRadius: 5, overflow: 'hidden', marginBottom: 5 },
  xpBarFill: { height: '100%', backgroundColor: '#34C759' },
  xpLabel: { fontSize: 12, color: '#8E8E93', textAlign: 'right' },

  startButton: { backgroundColor: '#007AFF', padding: 18, borderRadius: 16, alignItems: 'center', marginBottom: 20, shadowColor: '#007AFF', shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
  startButtonText: { color: '#FFF', fontSize: 18, fontWeight: '800' },

  linksRow: { flexDirection: 'row', justifyContent: 'space-between' },
  linkButton: { backgroundColor: '#FFF', flex: 0.48, padding: 15, borderRadius: 12, alignItems: 'center' },
  linkText: { color: '#007AFF', fontWeight: '600' },
});
