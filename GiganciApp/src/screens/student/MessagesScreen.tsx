import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../theme';
import { MESSAGES } from '../../data/mockData';
import Avatar from '../../components/Avatar';

export default function MessagesScreen() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');

  const filtered = MESSAGES.filter(m =>
    m.sender.toLowerCase().includes(search.toLowerCase()) ||
    m.preview.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>💬 {t('messages')}</Text>
        <TouchableOpacity style={styles.composeBtn}>
          <Text style={styles.composeText}>✏️</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchWrapper}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Szukaj wiadomości..."
          placeholderTextColor={Colors.textMuted}
          style={styles.searchInput}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={m => m.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item: m }) => (
          <TouchableOpacity style={styles.messageRow} activeOpacity={0.8}>
            <View style={styles.avatarWrapper}>
              <Avatar emoji={m.avatar} size={50} />
              {m.unread > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{m.unread}</Text>
                </View>
              )}
            </View>
            <View style={styles.messageBody}>
              <View style={styles.messageTop}>
                <Text style={[styles.senderName, m.unread > 0 && styles.senderNameBold]}>
                  {m.sender}
                </Text>
                <Text style={styles.messageTime}>{m.time}</Text>
              </View>
              <Text
                style={[styles.preview, m.unread > 0 && styles.previewBold]}
                numberOfLines={1}
              >
                {m.preview}
              </Text>
              <View style={styles.roleTag}>
                <Text style={styles.roleTagText}>
                  {m.senderRole === 'teacher' ? '👨‍🏫 Nauczyciel' :
                   m.senderRole === 'school' ? '🏫 Szkoła' : '👥 Grupa'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {/* Quick compose FAB */}
      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabText}>✏️</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, paddingBottom: Spacing.sm,
  },
  title: { ...Typography.h2, color: Colors.textPrimary },
  composeBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.primary + '18', alignItems: 'center', justifyContent: 'center',
  },
  composeText: { fontSize: 20 },
  searchWrapper: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: Spacing.lg, marginBottom: Spacing.md,
    backgroundColor: Colors.bgCard, borderRadius: Radius.round,
    paddingHorizontal: Spacing.md, borderWidth: 1.5, borderColor: Colors.border,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 12, color: Colors.textPrimary, fontSize: 14 },
  list: { paddingHorizontal: Spacing.lg, paddingBottom: 80 },
  messageRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    paddingVertical: Spacing.md,
  },
  avatarWrapper: { position: 'relative' },
  unreadBadge: {
    position: 'absolute', top: -2, right: -2,
    backgroundColor: Colors.primary, width: 20, height: 20, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.bg,
  },
  unreadText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  messageBody: { flex: 1 },
  messageTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  senderName: { color: Colors.textSecondary, fontSize: 15, fontWeight: '500' },
  senderNameBold: { color: Colors.textPrimary, fontWeight: '700' },
  messageTime: { color: Colors.textMuted, fontSize: 12 },
  preview: { color: Colors.textMuted, fontSize: 13, marginBottom: 4 },
  previewBold: { color: Colors.textSecondary, fontWeight: '600' },
  roleTag: {},
  roleTagText: { color: Colors.textMuted, fontSize: 11 },
  separator: { height: 1, backgroundColor: Colors.border, marginLeft: 66 },
  fab: {
    position: 'absolute', bottom: 24, right: 24,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
    ...Shadow.card,
  },
  fabText: { fontSize: 22 },
});
