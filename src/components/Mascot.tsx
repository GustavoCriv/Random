import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';

export type MascotMood = 'neutral' | 'happy' | 'excited' | 'tired' | 'celebrating';

interface MascotProps {
  mood?: MascotMood;
  message?: string;
  isTalking?: boolean;
}

export const Mascot: React.FC<MascotProps> = ({ 
  mood = 'neutral', 
  message = "Let's get strong!", 
  isTalking = false 
}) => {
  const bounceAnim = useState(new Animated.Value(0))[0];
  const eyeBlink = useState(new Animated.Value(1))[0];

  // Animation Logic
  useEffect(() => {
    // Breathing/Bouncing animation
    const bounce = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -5,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    bounce.start();

    // Blinking logic
    const blink = Animated.loop(
      Animated.sequence([
        Animated.timing(eyeBlink, { toValue: 0.1, duration: 150, useNativeDriver: true }),
        Animated.timing(eyeBlink, { toValue: 1, duration: 3000, useNativeDriver: true }),
      ])
    );
    blink.start();

    return () => {
      bounce.stop();
      blink.stop();
    };
  }, []);

  // Dynamic Styles based on Mood
  const getColors = () => {
    switch (mood) {
      case 'excited': return { body: '#FFD700', glow: '#FFFACD' }; // Gold
      case 'happy': return { body: '#34C759', glow: '#E0F9E6' };   // Green
      case 'tired': return { body: '#8E8E93', glow: '#F2F2F7' };   // Gray
      case 'celebrating': return { body: '#FF2D55', glow: '#FFE5EC' }; // Pink/Red
      default: return { body: '#007AFF', glow: '#E0F0FF' };        // Blue
    }
  };

  const colors = getColors();
  const faceEmoji = mood === 'tired' ? '😫' : mood === 'celebrating' ? '🤩' : mood === 'excited' ? '😁' : '🙂';

  return (
    <View style={styles.container}>
      {/* Speech Bubble */}
      <Animated.View style={[styles.speechBubble, { opacity: isTalking ? 1 : 0.9 }]}>
        <Text style={styles.speechText}>{message}</Text>
        <View style={styles.bubbleTail} />
      </Animated.View>

      {/* Mascot Body */}
      <Animated.View 
        style={[
          styles.mascotBody, 
          { 
            backgroundColor: colors.body,
            shadowColor: colors.body,
            transform: [{ translateY: bounceAnim }]
          }
        ]}
      >
        {/* Shine effect */}
        <View style={styles.shine} />
        
        {/* Eyes */}
        <View style={styles.eyesRow}>
          <Animated.View style={[styles.eye, { opacity: eyeBlink }]} />
          <Animated.View style={[styles.eye, { opacity: eyeBlink }]} />
        </View>

        {/* Mouth */}
        <Text style={styles.mouth}>{faceEmoji}</Text>
        
        {/* Arms (Simple circles for now) */}
        <View style={[styles.arm, styles.leftArm]} />
        <View style={[styles.arm, styles.rightArm]} />
      </Animated.View>
      
      {/* Shadow */}
      <View style={styles.shadow} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginVertical: 20, height: 160 },
  speechBubble: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 20,
    borderBottomLeftRadius: 2,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    maxWidth: 200,
  },
  speechText: { fontSize: 14, fontWeight: '600', color: '#333', textAlign: 'center' },
  bubbleTail: {
    position: 'absolute',
    bottom: -6,
    left: '50%',
    marginLeft: -6,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FFFFFF',
  },
  mascotBody: {
    width: 100,
    height: 110,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 4,
    borderColor: '#FFF',
  },
  shine: {
    position: 'absolute',
    top: 15,
    left: 20,
    width: 20,
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 10,
    transform: [{ rotate: '-45deg' }],
  },
  eyesRow: { flexDirection: 'row', marginTop: 10 },
  eye: {
    width: 12,
    height: 16,
    backgroundColor: '#000',
    borderRadius: 6,
    marginHorizontal: 12,
  },
  mouth: {
    fontSize: 24,
    marginTop: 5,
  },
  arm: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  leftArm: { top: 40, left: -10 },
  rightArm: { top: 40, right: -10 },
  shadow: {
    width: 60,
    height: 10,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 30,
    marginTop: 10,
  },
});
