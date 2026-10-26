import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Easing,
  SafeAreaView,
  Image,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');
const IMAGE_SIZE = Math.min(width * 0.78, 300);

const SLIDES = [
  {
    id: 'alone',
    title: "You're Never Alone",
    description:
      'Share your thoughts, feelings, worries, dreams, or victories — anytime, without judgment.',
    image: require('../../../assets/alone.png'),
  },
  {
    id: 'feelings',
    title: 'Understands Your Feelings',
    description:
      'Aura recognizes emotional context and responds with empathy, kindness, and understanding.',
    image: require('../../../assets/feelings.png'),
  },
  {
    id: 'matters',
    title: 'Remembers What Matters',
    description:
      'Important moments, goals, and conversations stay connected so every interaction feels meaningful.',
    image: require('../../../assets/matters.png'),
  },
  {
    id: 'anytime',
    title: 'Available Anytime',
    description:
      'Text, voice, or simply sit together in silence. Aura is always here for you.',
    image: require('../../../assets/anytime.png'),
  },
];

export function OnboardingView({ onComplete }: { onComplete: () => void }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [nextIdx, setNextIdx] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const transitionProgress = useRef(new Animated.Value(0)).current;

  const animateToNext = (targetIdx: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setNextIdx(targetIdx);
    transitionProgress.setValue(0);

    Animated.timing(transitionProgress, {
      toValue: 1,
      duration: 1200,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      useNativeDriver: true,
    }).start(() => {
      setCurrentIdx(targetIdx);
      setNextIdx(null);
      transitionProgress.setValue(0);
      setIsAnimating(false);
    });
  };

  const handleNext = () => {
    if (isAnimating) return;
    if (currentIdx < SLIDES.length - 1) {
      animateToNext(currentIdx + 1);
    } else {
      onComplete();
    }
  };

  const outgoingOpacity = transitionProgress.interpolate({
    inputRange: [0, 0.7, 1],
    outputRange: [1, 0.2, 0],
  });
  const outgoingTranslateX = transitionProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -32],
  });

  const incomingOpacity = transitionProgress.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 0.5, 1],
  });
  const incomingTranslateX = transitionProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [32, 0],
  });

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* ─── Top Header: Skip ─── */}
      <View style={styles.headerBar}>
        {currentIdx < SLIDES.length - 1 ? (
          <TouchableOpacity
            onPress={onComplete}
            activeOpacity={0.7}
            style={styles.skipBtn}
            disabled={isAnimating}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ height: 20 }} />
        )}
      </View>

      {/* ─── Middle Visual Stage: Rendered Asset Images ─── */}
      <View style={styles.graphicContainer}>
        {/* Outgoing Image */}
        <Animated.View
          style={[
            styles.stageLayer,
            {
              opacity: outgoingOpacity,
              transform: [{ translateX: outgoingTranslateX }],
            },
          ]}
        >
          <Image
            source={SLIDES[currentIdx].image}
            style={styles.slideImage}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Incoming Image */}
        {nextIdx !== null && (
          <Animated.View
            style={[
              styles.stageLayer,
              {
                opacity: incomingOpacity,
                transform: [{ translateX: incomingTranslateX }],
              },
            ]}
          >
            <Image
              source={SLIDES[nextIdx].image}
              style={styles.slideImage}
              resizeMode="contain"
            />
          </Animated.View>
        )}
      </View>

      {/* ─── Bottom Content Stage ─── */}
      <View style={styles.textAndActionContainer}>
        <View style={styles.textStage}>
          {/* Outgoing Text */}
          <Animated.View
            style={[
              styles.textLayer,
              {
                opacity: outgoingOpacity,
                transform: [{ translateX: outgoingTranslateX }],
              },
            ]}
          >
            <Text style={styles.slideTitle}>{SLIDES[currentIdx].title}</Text>
            <Text style={styles.slideDesc}>{SLIDES[currentIdx].description}</Text>
          </Animated.View>

          {/* Incoming Text */}
          {nextIdx !== null && (
            <Animated.View
              style={[
                styles.textLayer,
                {
                  opacity: incomingOpacity,
                  transform: [{ translateX: incomingTranslateX }],
                },
              ]}
            >
              <Text style={styles.slideTitle}>{SLIDES[nextIdx].title}</Text>
              <Text style={styles.slideDesc}>{SLIDES[nextIdx].description}</Text>
            </Animated.View>
          )}
        </View>

        {/* ─── Footer Action Row (Static UI) ─── */}
        <View style={styles.actionRow}>
          <View style={styles.dotsPillGroup}>
            {SLIDES.map((_, i) => {
              const isActive = (nextIdx !== null ? nextIdx : currentIdx) === i;
              return (
                <View
                  key={i}
                  style={[
                    styles.dotBase,
                    isActive ? styles.activeDot : styles.inactiveDot,
                  ]}
                />
              );
            })}
          </View>

          <TouchableOpacity
            style={styles.continueBtn}
            onPress={handleNext}
            activeOpacity={0.88}
            disabled={isAnimating}
          >
            <Text style={styles.continueBtnText}>
              {currentIdx === SLIDES.length - 1 ? 'Get Started' : 'Continue'}
            </Text>
            <Text style={styles.arrowIcon}>→</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#0A0C1A',
    justifyContent: 'space-between',
    paddingHorizontal: 26,
    paddingBottom: 28,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: 10,
    height: 44,
  },
  skipBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  skipText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.45)',
    fontWeight: '600',
  },
  graphicContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  stageLayer: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slideImage: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 24,
  },
  textAndActionContainer: {
    paddingBottom: 16,
  },
  textStage: {
    height: 120,
    position: 'relative',
    marginBottom: 20,
  },
  textLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  slideTitle: {
    fontSize: 27,
    fontWeight: '900',
    color: '#F8FAFC',
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  slideDesc: {
    fontSize: 14.5,
    color: 'rgba(255, 255, 255, 0.58)',
    lineHeight: 22,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dotsPillGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dotBase: {
    height: 5,
    borderRadius: 3,
  },
  activeDot: {
    width: 20,
    backgroundColor: '#818CF8',
  },
  inactiveDot: {
    width: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  continueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366F1',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 18,
    gap: 6,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 8,
  },
  continueBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  arrowIcon: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});