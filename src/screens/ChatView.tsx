import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { Sparkles } from "lucide-react-native";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { QuickChips } from "@/components/chat/QuickChips";
import { ChatInputBar } from "@/components/chat/ChatInputBar";
import { AiService } from "@/services/ai";
import { ChatMessage } from "@/types";

interface ChatViewProps {
  userMood: string | null;
}

export function ChatView({ userMood }: ChatViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "1", text: "Hey Tanmay! 👋 How are you feeling today?", role: "ai", time: "10:30 AM" },
    { id: "2", text: "Feeling a bit stressed about work...", role: "user", time: "10:31 AM" },
    {
      id: "3",
      text: "I hear you. Work stress can feel really heavy sometimes. Would you like to talk about what's going on? I'm fully here for you 💙",
      role: "ai",
      time: "10:32 AM",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), text, role: "user", time: "Now" };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput("");

    const aiReply = await AiService.sendMessage(history, text, userMood || undefined);
    setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), text: aiReply, role: "ai", time: "Now" }]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <View style={styles.avatarBadge}>
            <Sparkles size={16} color="#fff" />
          </View>
          <View>
            <Text style={styles.name}>Aura</Text>
            <Text style={styles.status}>▪ Always here for you</Text>
          </View>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingVertical: 14 }}>
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
      </ScrollView>

      <QuickChips onSelectChip={handleSend} />
      <ChatInputBar input={input} onChangeInput={setInput} onSend={() => handleSend()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  avatarBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#818CF8",
    justifyContent: "center",
    alignItems: "center",
  },
  name: { color: "#F8FAFC", fontSize: 16, fontWeight: "700" },
  status: { color: "#34D399", fontSize: 11 },
});

