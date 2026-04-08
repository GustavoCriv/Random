import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Mascot from '../../src/components/Mascot';
import { saveOnboardingData } from '../../src/lib/storage';

type Step = 'goal' | 'experience' | 'frequency' | 'type' | 'stats';

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('goal');
  
  // State
  const [goal, setGoal] = useState<string>('');
  const [experience, setExperience] = useState<string>('');
  const [days, setDays] = useState<number>(3);
  const [type, setType] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');

  const handleNext = () => {
    if (step === 'goal' && !goal) return Alert.alert("Hey!", "Pick a goal first!");
    if (step === 'experience' && !experience) return Alert.alert("Wait!", "How experienced are you?");
    if (step === 'type' && !type) return Alert.alert("Hold on!", "Where will you train?");
    
    if (step === 'stats') {
      finishOnboarding();
    } else {
      setStep(prev => {
        if (prev === 'goal') return 'experience';
        if (prev === 'experience') return 'frequency';
        if (prev === 'frequency') return 'type';
        if (prev === 'type') return 'stats';
        return prev;
      });
    }
  };

  const finishOnboarding = async () => {
    const profile = {
      goal: goal as any,
      experience_level: experience as any,
      training_days_per_week: days,
      training_type: type as any,
      body_weight_kg: weight ? parseFloat(weight) : undefined,
      height_cm: height ? parseFloat(height) : undefined,
    };
    
    await saveOnboardingData(profile);
    Alert.alert("Let's Go!", "Your starter plan is ready. Iron is waiting!", [
      { text: "Start Training", onPress: () => router.replace('/') }
    ]);
  };

  const getMascotMessage = () => {
    switch(step) {
      case 'goal': return "What's your main mission? Strength? Gains? Let's define it!";
      case 'experience': return "Be honest! Have you lifted before or just starting?";
      case 'frequency': return "How many days can you commit? Consistency is key!";
      case 'type': return "Where will we train? Gym, Home, or just Bodyweight?";
      case 'stats': return "Last step! Optional: Height & Weight help me calculate your power.";
      default: return "Let's do this!";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Mascot mood="happy" />
        <View style={styles.bubble}>
          <Text style={styles.bubbleText}>{getMascotMessage()}</Text>
        </View>

        <View style={styles.card}>
          {step === 'goal' && (
            <>
              <Text style={styles.title}>Select Your Goal</Text>
              {['strength', 'hypertrophy', 'fat_loss', 'general'].map(g => (
                <TouchableOpacity key={g} style={[styles.option, goal === g && styles.selected]} onPress={() => setGoal(g)}>
                  <Text style={[styles.optionText, goal === g && styles.selectedText]}>
                    {g === 'hypertrophy' ? 'Muscle Growth' : g.replace('_', ' ').toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </>
          )}

          {step === 'experience' && (
            <>
              <Text style={styles.title}>Experience Level</Text>
              {['beginner', 'intermediate', 'advanced'].map(l => (
                <TouchableOpacity key={l} style={[styles.option, experience === l && styles.selected]} onPress={() => setExperience(l)}>
                  <Text style={[styles.optionText, experience === l && styles.selectedText]}>
                    {l.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </>
          )}

          {step === 'frequency' && (
            <>
              <Text style={styles.title}>Days per Week</Text>
              <View style={styles.daysRow}>
                {[2, 3, 4, 5, 6].map(d => (
                  <TouchableOpacity key={d} style={[styles.dayBtn, days === d && styles.selectedDay]} onPress={() => setDays(d)}>
                    <Text style={[styles.dayText, days === d && styles.selectedText]}>{d}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {step === 'type' && (
            <>
              <Text style={styles.title}>Training Type</Text>
              {['gym', 'home', 'bodyweight'].map(t => (
                <TouchableOpacity key={t} style={[styles.option, type === t && styles.selected]} onPress={() => setType(t)}>
                  <Text style={[styles.optionText, type === t && styles.selectedText]}>
                    {t.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </>
          )}

          {step === 'stats' && (
            <>
              <Text style={styles.title}>Body Stats (Optional)</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Weight (kg)" 
                keyboardType="numeric" 
                value={weight} 
                onChangeText={setWeight} 
              />
              <TextInput 
                style={styles.input} 
                placeholder="Height (cm)" 
                keyboardType="numeric" 
                value={height} 
                onChangeText={setHeight} 
              />
            </>
          )}
        </View>

        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextBtnText}>{step === 'stats' ? 'FINISH' : 'NEXT'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  content: { padding: 20, alignItems: 'center' },
  bubble: { backgroundColor: '#FFF', padding: 15, borderRadius: 20, marginBottom: 20, borderWidth: 1, borderColor: '#DDD', maxWidth: '90%' },
  bubbleText: { fontSize: 16, textAlign: 'center', color: '#333', fontWeight: '600' },
  card: { backgroundColor: '#FFF', width: '100%', padding: 20, borderRadius: 20, marginBottom: 20 },
  title: { fontSize: 20, fontWeight: '800', marginBottom: 20, textAlign: 'center', color: '#1C1C1E' },
  option: { padding: 15, borderRadius: 12, borderWidth: 2, borderColor: '#E5E5EA', marginBottom: 10, alignItems: 'center' },
  selected: { borderColor: '#007AFF', backgroundColor: '#F0F8FF' },
  optionText: { fontSize: 16, fontWeight: '600', color: '#8E8E93' },
  selectedText: { color: '#007AFF', fontWeight: '800' },
  daysRow: { flexDirection: 'row', justifyContent: 'space-between' },
  dayBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#E5E5EA', justifyContent: 'center', alignItems: 'center' },
  selectedDay: { backgroundColor: '#007AFF' },
  dayText: { fontSize: 18, fontWeight: '700', color: '#8E8E93' },
  input: { backgroundColor: '#F2F2F7', padding: 15, borderRadius: 12, marginBottom: 10, fontSize: 16 },
  nextBtn: { backgroundColor: '#34C759', padding: 18, borderRadius: 16, width: '100%', alignItems: 'center', shadowColor: '#34C759', shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  nextBtnText: { color: '#FFF', fontSize: 18, fontWeight: '900' },
});
