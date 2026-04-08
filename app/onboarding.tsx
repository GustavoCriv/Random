import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Mascot from '../src/components/Mascot';
import { supabase } from '../src/lib/supabase';
import { storage } from '../src/lib/storage';
import { Goal, ExperienceLevel, TrainingType } from '../src/types';

type Step = 'goal' | 'experience' | 'frequency' | 'type' | 'bodyweight' | 'finish';

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('goal');
  
  // State
  const [goal, setGoal] = useState<Goal | null>(null);
  const [experience, setExperience] = useState<ExperienceLevel | null>(null);
  const [days, setDays] = useState<number | null>(null);
  const [type, setType] = useState<TrainingType | null>(null);
  const [bodyWeight, setBodyWeight] = useState<string>('');

  const handleNext = () => {
    if (step === 'goal' && goal) setStep('experience');
    else if (step === 'experience' && experience) setStep('frequency');
    else if (step === 'frequency' && days) setStep('type');
    else if (step === 'type' && type) setStep('bodyweight');
    else if (step === 'bodyweight') finishOnboarding();
  };

  const finishOnboarding = async () => {
    const bw = parseFloat(bodyWeight) || 75; // Default 75kg if empty
    
    // Save locally first (Offline First)
    await storage.saveProfile({
      goal: goal!,
      experience: experience!,
      trainingType: type!,
      daysPerWeek: days!,
      bodyWeight: bw,
    });

    // Try to save to Supabase if online
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('profiles').upsert({
          id: user.id,
          goal,
          experience,
          training_type: type,
          days_per_week: days,
          body_weight: bw,
        });
      }
    } catch (e) {
      console.log("Offline mode, saved locally");
    }

    Alert.alert("Welcome to IronPath!", "Your starter plan is ready. Let's train!");
    router.replace('/');
  };

  const getMascotText = () => {
    switch(step) {
      case 'goal': return "What's your main mission? Be honest!";
      case 'experience': return "How long have you been lifting?";
      case 'frequency': return "How many days can you train?";
      case 'type': return "Where will you be training?";
      case 'bodyweight': return "What's your bodyweight? (Optional)";
      default: return "Let's go!";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.mascotArea}>
          <Mascot mood="happy" />
          <View style={styles.bubble}>
            <Text style={styles.bubbleText}>{getMascotText()}</Text>
          </View>
        </View>

        <View style={styles.form}>
          {step === 'goal' && (
            <>
              <OptionButton title="💪 Strength" onPress={() => setGoal('strength')} selected={goal === 'strength'} />
              <OptionButton title="🏋️ Hypertrophy" onPress={() => setGoal('hypertrophy')} selected={goal === 'hypertrophy'} />
              <OptionButton title="🔥 Fat Loss" onPress={() => setGoal('fat_loss')} selected={goal === 'fat_loss'} />
              <OptionButton title="🏃 General Fitness" onPress={() => setGoal('general')} selected={goal === 'general'} />
            </>
          )}

          {step === 'experience' && (
            <>
              <OptionButton title="👶 Beginner (<6 months)" onPress={() => setExperience('beginner')} selected={experience === 'beginner'} />
              <OptionButton title="👦 Intermediate (6m-2y)" onPress={() => setExperience('intermediate')} selected={experience === 'intermediate'} />
              <OptionButton title="🧔 Advanced (2y+)" onPress={() => setExperience('advanced')} selected={experience === 'advanced'} />
            </>
          )}

          {step === 'frequency' && (
            <View style={styles.row}>
              {[2, 3, 4, 5, 6].map((d) => (
                <TouchableOpacity 
                  key={d} 
                  style={[styles.dayBtn, days === d && styles.dayBtnSelected]} 
                  onPress={() => setDays(d)}
                >
                  <Text style={[styles.dayText, days === d && styles.dayTextSelected]}>{d}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {step === 'type' && (
            <>
              <OptionButton title="🏢 Gym" onPress={() => setType('gym')} selected={type === 'gym'} />
              <OptionButton title="🏠 Home (Dumbbells)" onPress={() => setType('home')} selected={type === 'home'} />
              <OptionButton title="🤸 Bodyweight Only" onPress={() => setType('bodyweight')} selected={type === 'bodyweight'} />
            </>
          )}

          {step === 'bodyweight' && (
            <View style={styles.inputContainer}>
              <TextInput 
                style={styles.input} 
                placeholder="e.g. 75" 
                keyboardType="numeric" 
                value={bodyWeight}
                onChangeText={setBodyWeight}
              />
              <Text style={styles.hint}>We use this to normalize your Lift Points.</Text>
            </View>
          )}
        </View>

        {(step !== 'bodyweight' || bodyWeight !== '') && step !== 'finish' && (
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.nextText}>
              {step === 'bodyweight' ? "FINISH SETUP 🚀" : "NEXT STEP →"}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const OptionButton = ({ title, onPress, selected }: any) => (
  <TouchableOpacity 
    style={[styles.optionBtn, selected && styles.optionBtnSelected]} 
    onPress={onPress}
  >
    <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  scroll: { padding: 20, alignItems: 'center' },
  mascotArea: { alignItems: 'center', marginBottom: 30 },
  bubble: { backgroundColor: '#FFF', padding: 15, borderRadius: 20, marginTop: 15, borderWidth: 1, borderColor: '#DDD', maxWidth: 250 },
  bubbleText: { textAlign: 'center', fontSize: 15, fontWeight: '600', color: '#333' },
  form: { width: '100%', alignItems: 'center' },
  optionBtn: { width: '100%', backgroundColor: '#FFF', padding: 18, borderRadius: 16, marginBottom: 12, borderWidth: 2, borderColor: '#E5E5EA', alignItems: 'center' },
  optionBtnSelected: { borderColor: '#007AFF', backgroundColor: '#F0F8FF' },
  optionText: { fontSize: 16, fontWeight: '600', color: '#333' },
  optionTextSelected: { color: '#007AFF', fontWeight: '800' },
  row: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  dayBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#E5E5EA' },
  dayBtnSelected: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  dayText: { fontSize: 18, fontWeight: 'bold', color: '#8E8E93' },
  dayTextSelected: { color: '#FFF' },
  inputContainer: { width: '100%', alignItems: 'center' },
  input: { width: '80%', backgroundColor: '#FFF', padding: 15, borderRadius: 12, fontSize: 18, textAlign: 'center', marginBottom: 10, borderWidth: 1, borderColor: '#DDD' },
  hint: { color: '#8E8E93', fontSize: 12 },
  nextBtn: { backgroundColor: '#000', padding: 18, borderRadius: 16, width: '100%', alignItems: 'center', marginTop: 30 },
  nextText: { color: '#FFF', fontSize: 18, fontWeight: '800' },
});
