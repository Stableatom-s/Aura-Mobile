import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Easing,
} from 'react-native';
import { X, MicOff, PhoneOff, Volume2 } from 'lucide-react-native';
import { GlowingOrb } from '@/components/common/GlowingOrb';
import { ScreenState } from '@/types';

interface VoiceCallViewProps {
  onBack: () => void;
  onNavigate: (screen: ScreenState) => void;
  detectedMood?: string;
}

export function VoiceCallView({
  onBack,
  onNavigate,
  detectedMood = 'Calm detected',
}: VoiceCallViewProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);

  // Dynamic waveform bars
  const waveHeights = useRef(
    [10, 18, 14, 28, 20, 36, 16, 26, 40, 22, 34, 18, 28, 14, 22, 12].map(
      (val) => new Animated.Value(val)
    )
  ).current;

  useEffect(() => {
    const waveAnimations = waveHeights.map((anim, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 8 + Math.random() * 32,
            duration: 350 + (i % 5) * 80,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(anim, {
            toValue: 6 + Math.random() * 18,
            duration: 350 + (i % 5) * 80,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ])
      )
    );

    waveAnimations.forEach((anim) => anim.start());

    return () => {
      waveAnimations.forEach((anim) => anim.stop());
    };
  }, []);

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* Top Header Row */}
      <View style={styles.topRow}>
        <View style={styles.listeningBadge}>
          <Text style={styles.micEmoji}>🎙️</Text>
          <Text style={styles.listeningText}>Listening...</Text>
        </View>

        <TouchableOpacity style={styles.closeBtn} onPress={onBack} activeOpacity={0.7}>
          <X size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Mood Detection Pill */}
      <View style={styles.moodBadgeContainer}>
        <View style={styles.moodPill}>
          <Text style={styles.moodEmoji}>😌</Text>
          <Text style={styles.moodPillText}>{detectedMood}</Text>
        </View>
      </View>

      {/* Center Cinematic Glowing Orb */}
      <View style={styles.orbCenter}>
        <GlowingOrb size={88} />
      </View>

      {/* Audio Waveform Visualizer */}
      <View style={styles.waveformRow}>
        {waveHeights.map((animHeight, index) => (
          <Animated.View
            key={index}
            style={[
              styles.waveBar,
              {
                height: animHeight,
              },
            ]}
          />
        ))}
      </View>

      {/* Subtitle / AI Whisper */}
      <Text style={styles.whisperText}>
        Tell me more — I'm right here with you.
      </Text>

      {/* Call Actions Row */}
      <View style={styles.callControlsRow}>
        {/* Mute Button */}
        <TouchableOpacity
          style={styles.controlItem}
          onPress={() => setIsMuted((prev) => !prev)}
          activeOpacity={0.75}
        >
          <View style={[styles.controlCircle, isMuted && styles.controlCircleActive]}>
            <MicOff size={22} color={isMuted ? '#EF4444' : '#FFFFFF'} />
          </View>
          <Text style={styles.controlLabel}>{isMuted ? 'Unmute' : 'Mute'}</Text>
        </TouchableOpacity>

        {/* End Call Button */}
        <TouchableOpacity
          style={styles.controlItem}
          onPress={onBack}
          activeOpacity={0.75}
        >
          <View style={styles.endCallCircle}>
            <PhoneOff size={24} color="#FFFFFF" />
          </View>
          <Text style={styles.controlLabel}>End</Text>
        </TouchableOpacity>

        {/* Speaker Button */}
        <TouchableOpacity
          style={styles.controlItem}
          onPress={() => setIsSpeakerOn((prev) => !prev)}
          activeOpacity={0.75}
        >
          <View style={[styles.controlCircle, !isSpeakerOn && styles.controlCircleInactive]}>
            <Volume2 size={22} color={isSpeakerOn ? '#FFFFFF' : 'rgba(255, 255, 255, 0.4)'} />
          </View>
          <Text style={styles.controlLabel}>Speaker</Text>
        </TouchableOpacity>
      </View>

      {/* Switch to Text Mode Button */}
      <View style={styles.textModeContainer}>
        <TouchableOpacity
          style={styles.textModeBtn}
          onPress={() => onNavigate('chat')}
          activeOpacity={0.75}
        >
          <Text style={styles.textModeBtnText}>Switch to Text Mode</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#0A0D18',
    justifyContent: 'space-between',
    paddingBottom: 80,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  listeningBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(99, 102, 241, 0.18)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(129, 140, 248, 0.35)',
  },
  micEmoji: {
    fontSize: 13,
  },
  listeningText: {
    color: '#818CF8',
    fontSize: 13,
    fontWeight: '700',
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moodBadgeContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  moodPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  moodEmoji: {
    fontSize: 14,
  },
  moodPillText: {
    color: '#34D399',
    fontSize: 13,
    fontWeight: '600',
  },
  orbCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 14,
  },
  waveformRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    gap: 4.5,
    paddingHorizontal: 30,
  },
  waveBar: {
    width: 3.5,
    backgroundColor: '#818CF8',
    borderRadius: 2,
    opacity: 0.85,
  },
  whisperText: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 15,
    textAlign: 'center',
    paddingHorizontal: 28,
    fontWeight: '500',
    marginTop: 4,
  },
  callControlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
    marginTop: 20,
  },
  controlItem: {
    alignItems: 'center',
    gap: 8,
  },
  controlCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  controlCircleActive: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: '#EF4444',
  },
  controlCircleInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  endCallCircle: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 8,
  },
  controlLabel: {
    color: 'rgba(255, 255, 255, 0.55)',
    fontSize: 12,
    fontWeight: '600',
  },
  textModeContainer: {
    alignItems: 'center',
    marginTop: 14,
  },
  textModeBtn: {
    backgroundColor: 'rgba(23, 27, 46, 0.85)',
    borderRadius: 22,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  textModeBtnText: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 13,
    fontWeight: '600',
  },
});