import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { Mic, MicOff, X } from 'lucide-react-native';
import { GlowingOrb } from '@/components/common/GlowingOrb';
import { useAppTheme } from '@/context/ThemeContext';

interface VoiceModalViewProps {
  onClose: () => void;
}

export function VoiceModalView({ onClose }: VoiceModalViewProps) {
  const [isListening, setIsListening] = useState(true);
  const { colors, fonts, accentColor } = useAppTheme();

  return (
    <View style={[styles.overlay, { backgroundColor: colors.background }]}>
      {/* Close Button */}
      <TouchableOpacity
        style={[
          styles.closeBtn,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
        onPress={onClose}
        activeOpacity={0.7}
      >
        <X size={20} color={colors.textPrimary} />
      </TouchableOpacity>

      {/* Visualizer Area */}
      <View style={styles.orbArea}>
        <GlowingOrb size={140} />
        <Text
          style={[
            styles.statusText,
            { fontSize: fonts.subheading, color: colors.textSecondary },
          ]}
        >
          {isListening ? 'Listening to your voice...' : 'Aura is speaking...'}
        </Text>
      </View>

      {/* Bottom Controls */}
      <View style={styles.bottomControls}>
        <TouchableOpacity
          style={[
            styles.micBtn,
            isListening
              ? { backgroundColor: accentColor, shadowColor: accentColor }
              : styles.micBtnMuted,
          ]}
          onPress={() => setIsListening(!isListening)}
          activeOpacity={0.85}
        >
          {isListening ? (
            <Mic size={26} color="#FFFFFF" />
          ) : (
            <MicOff size={26} color="#EF4444" />
          )}
        </TouchableOpacity>

        <Text
          style={[
            styles.caption,
            { fontSize: fonts.caption, color: colors.textMuted },
          ]}
        >
          Tap microphone to {isListening ? 'pause' : 'resume'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 44,
    paddingBottom: Platform.OS === 'ios' ? 44 : 32,
    paddingHorizontal: 24,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orbArea: {
    alignItems: 'center',
    gap: 24,
  },
  statusText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  bottomControls: {
    alignItems: 'center',
    gap: 12,
  },
  micBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 15,
    elevation: 8,
  },
  micBtnMuted: {
    backgroundColor: 'rgba(239, 68, 68, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.35)',
  },
  caption: {
    textAlign: 'center',
  },
});