import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/context/ThemeContext';
import { apiService } from '@/services/apiService';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

interface ChatViewProps {
  userMood?: string | null;
}

export function ChatView({ userMood }: ChatViewProps) {
  const { colors, fonts, accentColor } = useAppTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: `Hi there. I'm Aura. ${
        userMood ? `I see you're feeling ${userMood.toLowerCase()} today. ` : ''
      }What's on your mind?`,
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const handleSend = async () => {
    const trimmed = inputText.trim();
    if (!trimmed || isStreaming) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmed,
    };

    const aiMsgId = `ai-${Date.now() + 1}`;
    const aiPlaceholder: Message = {
      id: aiMsgId,
      sender: 'ai',
      text: '',
    };

    const historySnapshot = messages.slice(-10).map((m) => ({
      sender: m.sender,
      text: m.text,
    }));

    setMessages((prev) => [...prev, userMsg, aiPlaceholder]);
    setInputText('');
    setIsStreaming(true);

    try {
      await apiService.streamChatMessage(
        {
          message: trimmed,
          moodContext: userMood,
          conversationHistory: historySnapshot,
        },
        (chunkText) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMsgId ? { ...msg, text: msg.text + chunkText } : msg
            )
          );
        }
      );
    } catch (error: any) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMsgId
            ? {
                ...msg,
                text:
                  msg.text ||
                  `Connection issue: ${error.message || 'Unable to reach Aura server.'}`,
              }
            : msg
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary, fontSize: fonts.subheading }]}>
          Aura Companion
        </Text>
        {userMood && (
          <View style={[styles.moodPill, { backgroundColor: `${accentColor}20` }]}>
            <Text style={[styles.moodText, { color: accentColor, fontSize: fonts.caption }]}>
              {userMood}
            </Text>
          </View>
        )}
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          renderItem={({ item }) => {
            const isUser = item.sender === 'user';
            return (
              <View
                style={[
                  styles.bubble,
                  isUser
                    ? [styles.userBubble, { backgroundColor: accentColor }]
                    : [
                        styles.aiBubble,
                        { backgroundColor: colors.surface, borderColor: colors.border },
                      ],
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    { fontSize: fonts.body, color: isUser ? '#FFFFFF' : colors.textPrimary },
                  ]}
                >
                  {item.text || (isStreaming ? '...' : '')}
                </Text>
              </View>
            );
          }}
        />

        <View style={[styles.inputBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Share what you're feeling..."
            placeholderTextColor={colors.textMuted}
            style={[styles.input, { color: colors.textPrimary, fontSize: fonts.body }]}
            multiline
          />
          <TouchableOpacity
            onPress={handleSend}
            disabled={isStreaming || !inputText.trim()}
            style={[
              styles.sendBtn,
              {
                backgroundColor:
                  isStreaming || !inputText.trim() ? colors.border : accentColor,
              },
            ]}
          >
            <Ionicons name="arrow-up" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerTitle: { fontWeight: '800' },
  moodPill: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  moodText: { fontWeight: '700' },
  listContent: { padding: 18, paddingBottom: 24, gap: 12 },
  bubble: { maxWidth: '82%', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 20 },
  userBubble: { alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  aiBubble: { alignSelf: 'flex-start', borderBottomLeftRadius: 4, borderWidth: 1 },
  messageText: { lineHeight: 21 },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 14,
    paddingVertical: 10,
    paddingBottom: 95, // Clears floating BottomNavDock
    borderTopWidth: 1,
    gap: 10,
  },
  input: { flex: 1, maxHeight: 100, paddingVertical: 8, paddingHorizontal: 12 },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});