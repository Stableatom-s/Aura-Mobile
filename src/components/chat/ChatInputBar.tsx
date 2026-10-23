import React from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import { Send, Smile, Mic } from 'lucide-react-native';

interface ChatInputBarProps {
  input: string;
  onChangeInput: (text: string) => void;
  onSend: () => void;
}

export function ChatInputBar({ input, onChangeInput, onSend }: ChatInputBarProps) {
  return (
    <View style={styles.chatInputBar}>
      <TextInput
        value={input}
        onChangeText={onChangeInput}
        placeholder="What's on your mind?"
        placeholderTextColor="rgba(255,255,255,0.4)"
        style={styles.chatTextInput}
      />
      <TouchableOpacity style={styles.chatActionIcon}>
        <Smile size={20} color="rgba(255,255,255,0.4)" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.chatActionIcon}>
        <Mic size={20} color="rgba(255,255,255,0.4)" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.sendSquareBtn} onPress={onSend}>
        <Send size={16} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  chatInputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 22,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 8,
  },
  chatTextInput: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    paddingVertical: 6,
  },
  chatActionIcon: {
    padding: 4,
  },
  sendSquareBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#818CF8',
    justifyContent: 'center',
    alignItems: 'center',
  },
});