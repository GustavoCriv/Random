import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { supabase } from '../src/lib/supabase';
import { RANK_TIERS } from '../src/utils/ranking';

interface Player {
  id: string;
  username: string;
  liftPoints: number;
  tier: string;
  avatar?: string;
}

export default function Leaderboard() {
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'global' | 'friends'>('global');

  useEffect(() => {
    fetchLeaderboard();
  }, [tab]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    // Mock data for demonstration since DB might be empty
    const mockData: Player[] = [
      { id: '1', username: 'You', liftPoints: 150, tier: 'Silver' },
      { id: '2', username: 'FitPro99', liftPoints: 850, tier: 'Platinum' },
      { id: '3', username: 'GymRat', liftPoints: 420, tier: 'Gold' },
      { id: '4', username: 'IronLady', liftPoints: 1200, tier: 'Diamond' },
      { id: '5', username: 'Newbie', liftPoints: 45, tier: 'Bronze' },
    ];
    
    // In production: query Supabase here
    // const { data } = await supabase.from('profiles').select('username, lift_points').order('lift_points', { ascending: false });
    
    setTimeout(() => {
      setPlayers(mockData.sort((a, b) => b.liftPoints - a.liftPoints));
      setLoading(false);
    }, 500);
  };

  const renderRow = ({ item, index }: { item: Player; index: number }) => (
    <View style={styles.row}>
      <Text style={[styles.rank, index < 3 && styles.rankTop]}>{index + 1}</Text>
      <View style={styles.userInfo}>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.tier}>{item.tier}</Text>
      </View>
      <Text style={styles.lp}>{item.liftPoints} LP</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>←</Text></TouchableOpacity>
        <Text style={styles.title}>Rankings</Text>
        <View style={{width: 20}} />
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, tab === 'global' && styles.tabActive]} 
          onPress={() => setTab('global')}
        >
          <Text style={[styles.tabText, tab === 'global' && styles.tabTextActive]}>Global</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, tab === 'friends' && styles.tabActive]} 
          onPress={() => setTab('friends')}
        >
          <Text style={[styles.tabText, tab === 'friends' && styles.tabTextActive]}>Friends</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={players}
        renderItem={renderRow}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  back: { fontSize: 24, color: '#007AFF' },
  title: { fontSize: 20, fontWeight: 'bold' },
  tabs: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 10 },
  tab: { flex: 1, padding: 10, alignItems: 'center', borderBottomWidth: 2, borderColor: 'transparent' },
  tabActive: { borderColor: '#007AFF' },
  tabText: { color: '#8E8E93', fontWeight: '600' },
  tabTextActive: { color: '#007AFF' },
  list: { paddingHorizontal: 20 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 15, borderRadius: 12, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.03, elevation: 2 },
  rank: { fontSize: 18, fontWeight: 'bold', color: '#8E8E93', width: 30 },
  rankTop: { color: '#FFD700' },
  userInfo: { flex: 1 },
  username: { fontSize: 16, fontWeight: 'bold', color: '#1C1C1E' },
  tier: { fontSize: 12, color: '#007AFF', marginTop: 2 },
  lp: { fontSize: 16, fontWeight: '800', color: '#333' }
});
