import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import { BackHeader } from '@/components/common/BackHeader';
import { GradientButton } from '@/components/ui/GradientButton';

interface NameSetupViewProps {
  onBack: () => void;
  onNext: (name: string) => void;
}

export function NameSetupView({ onBack, onNext }: NameSetupViewProps) {
  const [name, setName] = useState('');

  return (
    <View style={styles.container}>
      <BackHeader title="" onBack={onBack} />

      <View style={styles.body}>
        <Text style={styles.title}>What should we call you?</Text>
        <Text style={styles.subtitle}>Aura personalizes your daily experience with this name.</Text>

        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor="rgba(255,255,255,0.3)"
          style={styles.textInput}
          autoFocus
        />
      </View>

      <GradientButton
        title="Continue"
        onPress={() => onNext(name.trim() || 'Friend')}
        disabled={name.trim().length === 0}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, paddingVertical: 20, justifyContent: 'space-between' },
  body: { flex: 1, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '800', color: '#F8FAFC', marginBottom: 8 },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 28, lineHeight: 20 },
  textInput: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 16,
    color: '#FFFFFF',
    fontSize: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
});