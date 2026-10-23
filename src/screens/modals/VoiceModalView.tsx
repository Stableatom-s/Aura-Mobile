import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Mic, MicOff, X } from 'lucide-react-native';
import { GlowingOrb } from '@/components/common/GlowingOrb';

interface VoiceModalViewProps {
  onClose: () => void;
}

export function VoiceModalView({ onClose }: VoiceModalViewProps) {
  const [isListening, setIsListening] = useState(true);

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
        <X size={22} color="#FFFFFF" />
      </TouchableOpacity>

      <View style={styles.orbArea}>
        <GlowingOrb size={140} />
        <Text style={styles.statusText}>
          {isListening ? 'Listening to your voice...' : 'Aura is speaking...'}
        </Text>
      </View>

      <View style={styles.bottomControls}>
        <TouchableOpacity
          style={[styles.micBtn, !isListening && styles.micBtnMuted]}
          onPress={() => setIsListening(!isListening)}
        >
          {isListening ? <Mic size={26} color="#FFFFFF" /> : <MicOff size={26} color="#EF4444" />}
        </TouchableOpacity>
        <Text style={styles.caption}>Tap microphone to {isListening ? 'pause' : 'resume'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#0B0F19',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 24,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orbArea: { alignItems: 'center', gap: 24 },
  statusText: { color: 'rgba(255,255,255,0.7)', fontSize: 16, fontWeight: '600' },
  bottomControls: { alignItems: 'center', gap: 12 },
  micBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  micBtnMuted: { backgroundColor: 'rgba(239,68,68,0.2)' },
  caption: { color: 'rgba(255,255,255,0.35)', fontSize: 12 },
});