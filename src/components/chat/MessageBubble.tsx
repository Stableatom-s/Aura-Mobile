import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import { ChatMessage } from '@/types';

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isAi = message.role === 'ai';

  return (
    <View style={[styles.chatRow, isAi ? { justifyContent: 'flex-start' } : { justifyContent: 'flex-end' }]}>
      {isAi && (
        <View style={styles.msgAvatar}>
          <Sparkles size={12} color="#fff" />
        </View>
      )}
      <View style={[styles.chatBubble, isAi ? styles.chatBubbleAi : styles.chatBubbleUser]}>
        <Text style={styles.chatBubbleText}>{message.text}</Text>
        <Text style={styles.chatBubbleTime}>{message.time}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chatRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 12,
  },
  msgAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#818CF8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatBubble: {
    maxWidth: '76%',
    padding: 14,
    borderRadius: 20,
  },
  chatBubbleAi: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  chatBubbleUser: {
    backgroundColor: '#818CF8',
  },
  chatBubbleText: {
    color: '#F8FAFC',
    fontSize: 14,
    lineHeight: 20,
  },
  chatBubbleTime: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 10,
    marginTop: 4,
    textAlign: 'right',
  },
});