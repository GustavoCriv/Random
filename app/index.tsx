import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

type RankTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Master' | 'Grandmaster' | 'Challenger' | 'Titan' | 'Olympian';

const RANK_TIERS: RankTier[] = [
  'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 
  'Master', 'Grandmaster', 'Challenger', 'Titan', 'Olympian'
];

const getRankColor = (tier: RankTier) => {
  switch(tier) {
    case 'Bronze': return '#CD7F32';
    case 'Silver': return '#C0C0C0';
    case 'Gold': return '#FFD700';
    case 'Platinum': return '#E5E4E2';
    case 'Diamond': return '#B9F2FF';
    case 'Master': return '#8A2BE2';
    case 'Grandmaster': return '#FF4500';
    case 'Challenger': return '#00BFFF';
    case 'Titan': return '#4B0082';
    case 'Olympian': return '#FFFFFF';
    default: return '#8E8E93';
  }
};

const IronMascot = ({ mood }: { mood: 'happy' | 'excited' | 'neutral' }) => {
  const getColor = () => {
    if (mood === 'excited') return '#FFD700'; 
    if (mood === 'happy') return '#34C759';   
    return '#007AFF';                         
  };

  return (
    <View style={styles.mascotContainer}>
      <View style={[styles.mascotHead, { backgroundColor: getColor() }]}>
        <View style={styles.eyeLeft} />
        <View style={styles.eyeRight} />
        <Text style={styles.mouth}>{mood === 'neutral' ? '😐' : '😁'}</Text>
        <View style={styles.shine} />
      </View>
      
      <View style={styles.speechBubble}>
        <Text style={styles.speechText}>
          {mood === 'excited' ? "Let's hit a PR today! 💪" : 
           mood === 'happy' ? "Great consistency! 🔥" : 
           "Ready to train? 🏋️"}
        </Text>
      </View>
    </View>
  );
};

export default function Dashboard() {
  const [xp, setXp] = useState(1250);
  const [level, setLevel] = useState(5);
  const [rank, setRank] = useState<RankTier>('Silver');
  const [streak, setStreak] = useState(3);

  const nextLevelXp = level * 1000;
  const progressPercent = (xp % 1000) / 1000 * 100;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, Athlete</Text>
            <Text style={styles.title}>IronPath</Text>
          </View>
          <View style={[styles.rankBadge, { backgroundColor: getRankColor(rank) }]}>
            <Text style={styles.rankText}>{rank}</Text>
          </View>
        </View>

        <IronMascot mood="excited" />

        <View style={styles.streakCard}>
          <Text style={styles.streakLabel}>🔥 Current Streak</Text>
          <Text style={styles.streakValue}>{streak} Days</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Progress to Lvl {level + 1}</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{xp}</Text>
              <Text style={styles.statLabel}>Total XP</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{Math.floor(xp / 1000)}</Text>
              <Text style={styles.statLabel}>Workouts</Text>
            </View>
          </View>
          
          <View style={styles.xpBarBg}>
            <View style={[styles.xpBarFill, { width: `${progressPercent}%` }]} />
          </View>
          <Text style={styles.xpText}>{Math.floor(xp % 1000)} / 1000 XP</Text>
        </View>

        <TouchableOpacity 
          style={styles.startButton}
          onPress={() => alert("Navigating to Workout Logger...")}
        >
          <Text style={styles.startButtonText}>START WORKOUT</Text>
        </TouchableOpacity>

        <View style={styles.row}>
          <TouchableOpacity style={styles.secondaryBtn} onPress={() => alert("Opening Leaderboard...")}>
            <Text style={styles.secText}>🏆 Leaderboard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} onPress={() => alert("Opening Profile...")}>
            <Text style={styles.secText}>👤 Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  scrollContent: { padding: 24 },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  greeting: { fontSize: 16, color: '#8E8E93', fontWeight: '600' },
  title: { fontSize: 32, fontWeight: '900', color: '#1C1C1E', letterSpacing: -0.5 },
  rankBadge: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
  rankText: { color: '#FFF', fontWeight: '800', fontSize: 14, textShadowColor: 'rgba(0,0,0,0.2)', textShadowOffset: {width:0, height:1}, textShadowRadius: 2 },
  
  mascotContainer: { alignItems: 'center', marginBottom: 20 },
  mascotHead: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 12, borderWidth: 4, borderColor: '#FFF', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5, position: 'relative' },
  eyeLeft: { width: 12, height: 12, backgroundColor: '#000', borderRadius: 6, position: 'absolute', top: 35, left: 25 },
  eyeRight: { width: 12, height: 12, backgroundColor: '#000', borderRadius: 6, position: 'absolute', top: 35, right: 25 },
  mouth: { marginTop: 38, fontSize: 28 },
  shine: { position: 'absolute', top: 15, left: 20, width: 20, height: 10, backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 10, transform: [{rotate: '-45deg'}] },
  
  speechBubble: { backgroundColor: '#FFF', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 24, borderWidth: 1, borderColor: '#E5E5EA', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, maxWidth: width * 0.8 },
  speechText: { fontSize: 15, color: '#333', textAlign: 'center', fontWeight: '600', lineHeight: 22 },

  streakCard: { backgroundColor: '#FF9500', padding: 16, borderRadius: 16, marginBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#FF9500', shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  streakLabel: { color: '#FFF', fontWeight: '700', fontSize: 16 },
  streakValue: { color: '#FFF', fontWeight: '900', fontSize: 20 },

  card: { backgroundColor: '#FFF', padding: 24, borderRadius: 24, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 12, elevation: 4 },
  cardTitle: { fontSize: 18, fontWeight: '800', marginBottom: 20, color: '#1C1C1E' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  stat: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, backgroundColor: '#E5E5EA', marginHorizontal: 10 },
  statValue: { fontSize: 26, fontWeight: '900', color: '#007AFF' },
  statLabel: { fontSize: 13, color: '#8E8E93', marginTop: 4, fontWeight: '600' },
  
  xpBarBg: { height: 14, backgroundColor: '#E5E5EA', borderRadius: 7, overflow: 'hidden', marginBottom: 6 },
  xpBarFill: { height: '100%', backgroundColor: '#34C759', borderRadius: 7 },
  xpText: { fontSize: 13, color: '#8E8E93', textAlign: 'right', fontWeight: '600' },

  startButton: { backgroundColor: '#007AFF', padding: 22, borderRadius: 20, alignItems: 'center', marginBottom: 16, shadowColor: '#007AFF', shadowOpacity: 0.4, shadowRadius: 12, elevation: 6 },
  startButtonText: { color: '#FFF', fontSize: 20, fontWeight: '900', letterSpacing: 0.5 },

  row: { flexDirection: 'row', justifyContent: 'space-between' },
  secondaryBtn: { backgroundColor: '#FFF', flex: 0.48, padding: 18, borderRadius: 16, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  secText: { color: '#007AFF', fontWeight: '700', fontSize: 15 },
});
