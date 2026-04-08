import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { calculate1RM, calculateLiftPoints, calculateXP } from '../src/utils/ranking';
import { saveWorkoutLocal } from '../src/lib/storage';

export default function WorkoutLogger() {
  const router = useRouter();
  const [exercise, setExercise] = useState('Bench Press');
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [sets, setSets] = useState('3');

  const handleFinish = () => {
    if (!weight || !reps) {
      Alert.alert('Missing Data', 'Please enter weight and reps');
      return;
    }

    const w = parseFloat(weight);
    const r = parseInt(reps);
    const s = parseInt(sets) || 1;

    const oneRM = calculate1RM(w, r);
    // Mock bodyweight for calculation (in real app, fetch from profile)
    const lp = calculateLiftPoints(oneRM, 80); 
    const xp = calculateXP(w * r * s, false, 0);

    const workoutData = {
      exercise,
      weight: w,
      reps: r,
      sets: s,
      oneRepMax: oneRM,
      liftPoints: lp,
      xpEarned: xp,
      date: new Date().toISOString()
    };

    saveWorkoutLocal(workoutData);
    
    Alert.alert(
      "Workout Saved!", 
      `+${xp} XP | +${lp} LP\n1RM Estimate: ${oneRM}kg`,
      [{ text: "Awesome", onPress: () => router.back() }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.cancel}>Cancel</Text></TouchableOpacity>
        <Text style={styles.title}>Log Set</Text>
        <TouchableOpacity onPress={handleFinish}><Text style={styles.save}>Save</Text></TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Exercise</Text>
        <TextInput 
          style={styles.input} 
          value={exercise} 
          onChangeText={setExercise} 
          placeholder="e.g. Squat"
        />

        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>Weight (kg)</Text>
            <TextInput 
              style={styles.input} 
              value={weight} 
              onChangeText={setWeight} 
              keyboardType="numeric"
              placeholder="0"
            />
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>Reps</Text>
            <TextInput 
              style={styles.input} 
              value={reps} 
              onChangeText={setReps} 
              keyboardType="numeric"
              placeholder="0"
            />
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>Sets</Text>
            <TextInput 
              style={styles.input} 
              value={sets} 
              onChangeText={setSets} 
              keyboardType="numeric"
              placeholder="3"
            />
          </View>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Estimated Impact</Text>
          <Text style={styles.infoText}>
            Logging this set will calculate your 1RM and award Lift Points based on your bodyweight ratio.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderColor: '#EEE' },
  cancel: { color: '#FF3B30', fontSize: 16 },
  save: { color: '#007AFF', fontSize: 16, fontWeight: 'bold' },
  title: { fontSize: 18, fontWeight: 'bold' },
  content: { padding: 20 },
  label: { fontSize: 14, color: '#666', marginBottom: 8, fontWeight: '600' },
  input: { backgroundColor: '#F2F2F7', padding: 15, borderRadius: 12, fontSize: 16, marginBottom: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  col: { width: '32%' },
  infoBox: { backgroundColor: '#F0F9FF', padding: 15, borderRadius: 12, marginTop: 20, borderLeftWidth: 4, borderColor: '#007AFF' },
  infoTitle: { fontWeight: 'bold', color: '#007AFF', marginBottom: 5 },
  infoText: { color: '#555', fontSize: 13 }
});
