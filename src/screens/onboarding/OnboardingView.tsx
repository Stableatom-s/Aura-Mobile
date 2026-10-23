import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import { GlowingOrb } from '@/components/common/GlowingOrb';
import { GradientButton } from '@/components/ui/GradientButton';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    title: 'Your Safe Space',
    description:
      'An AI companion that listens without judgment, available 24/7 whenever you need to reflect.',
  },
  {
    title: 'Track Emotional Patterns',
    description:
      'Uncover trends in your daily mood, understand triggers, and build lasting mindfulness habits.',
  },
  {
    title: 'Private & Secure',
    description:
      'Your thoughts stay completely protected with end-to-end local isolation and encryption.',
  },
];

export function OnboardingView({ onComplete }: { onComplete: () => void }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const slideFade = useRef(new Animated.Value(1)).current;
  const slideTranslateX = useRef(new Animated.Value(0)).current;

  const animateToNext = (nextIndex: number) => {
    // 1-second smooth slide out & slide in
    Animated.parallel([
      Animated.timing(slideFade, {
        toValue: 0,
        duration: 380,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideTranslateX, {
        toValue: -28,
        duration: 380,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentIdx(nextIndex);
      slideTranslateX.setValue(28);

      Animated.parallel([
        Animated.timing(slideFade, {
          toValue: 1,
          duration: 620,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(slideTranslateX, {
          toValue: 0,
          duration: 620,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleNext = () => {
    if (currentIdx < SLIDES.length - 1) {
      animateToNext(currentIdx + 1);
    } else {
      onComplete();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topArea}>
        <GlowingOrb size={100} />
      </View>

      <Animated.View
        style={[
          styles.contentArea,
          {
            opacity: slideFade,
            transform: [{ translateX: slideTranslateX }],
          },
        ]}
      >
        <Text style={styles.slideTitle}>{SLIDES[currentIdx].title}</Text>
        <Text style={styles.slideDesc}>{SLIDES[currentIdx].description}</Text>

        <View style={styles.dotsRow}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                currentIdx === i ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>
      </Animated.View>

      <View style={styles.bottomArea}>
        <GradientButton
          title={currentIdx === SLIDES.length - 1 ? 'Get Started' : 'Continue'}
          onPress={handleNext}
        />
        {currentIdx < SLIDES.length - 1 && (
          <TouchableOpacity onPress={onComplete} style={styles.skipBtn}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingVertical: 40,
    backgroundColor: '#0A0D18',
  },
  topArea: {
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentArea: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  slideTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#F8FAFC',
    textAlign: 'center',
    marginBottom: 12,
  },
  slideDesc: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: width * 0.8,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 28,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  activeDot: {
    width: 22,
    backgroundColor: '#818CF8',
  },
  inactiveDot: {
    width: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  bottomArea: {
    gap: 12,
    marginTop: 20,
  },
  skipBtn: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  skipText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 13,
    fontWeight: '600',
  },
});