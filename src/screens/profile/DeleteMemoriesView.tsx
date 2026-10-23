import React from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { BackHeader } from '@/components/common/BackHeader';

export function DeleteMemoriesView({ onBack }: { onBack: () => void }) {
  const handleDelete = () => {
    Alert.alert(
      'Permanent Action',
      'This will erase all your logged journals, emotional trends, and AI session history. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Everything',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Data Cleared', 'Your memories have been erased.');
            onBack();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <BackHeader title="Delete Memories" onBack={onBack} />

      <View style={styles.centerArea}>
        <View style={styles.trashCircle}>
          <Trash2 size={36} color="#EF4444" />
        </View>
        <Text style={styles.title}>Clear All Personal Data</Text>
        <Text style={styles.description}>
          You have full ownership of your data. Tapping below permanently purges your journal entries,
          chat logs, and emotional stats from this device.
        </Text>
      </View>

      <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
        <Text style={styles.deleteText}>Delete All Data</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 10, justifyContent: 'space-between', paddingBottom: 40 },
  centerArea: { alignItems: 'center', paddingHorizontal: 16 },
  trashCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(239,68,68,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: { fontSize: 20, fontWeight: '700', color: '#F8FAFC', marginBottom: 10 },
  description: { color: 'rgba(255,255,255,0.5)', textAlign: 'center', fontSize: 13, lineHeight: 20 },
  deleteBtn: {
    backgroundColor: '#EF4444',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
  },
  deleteText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
});
