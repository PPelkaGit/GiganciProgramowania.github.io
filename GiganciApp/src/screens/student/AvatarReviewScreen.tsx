import React, { useCallback, useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useRealtimeAvatarChat, TranscriptEntry } from '../../hooks/useRealtimeAvatarChat';
import RiveAvatar, { STATE_CONFIG } from '../../components/RiveAvatar';
import { getLesson, PYTHON_LESSONS } from '../../data/pythonCurriculum';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../theme';

// ─── Navigation types ───────────────────────────────────────────────────────

type AvatarReviewParams = { lessonId?: string };
type AvatarReviewRouteProp = RouteProp<{ AvatarReview: AvatarReviewParams }, 'AvatarReview'>;

// ─── Transcript bubble ──────────────────────────────────────────────────────

function TranscriptBubble({ item }: { item: TranscriptEntry }) {
  const isPiko = item.role === 'piko';
  return (
    <View style={[styles.bubble, isPiko ? styles.bubblePiko : styles.bubbleStudent]}>
      {isPiko && <Text style={styles.bubbleRole}>Piko</Text>}
      <Text style={[styles.bubbleText, isPiko ? styles.bubbleTextPiko : styles.bubbleTextStudent]}>
        {item.text}
      </Text>
    </View>
  );
}

// ─── Main screen ────────────────────────────────────────────────────────────

export default function AvatarReviewScreen() {
  const navigation = useNavigation();
  const route = useRoute<AvatarReviewRouteProp>();
  const lessonId = route.params?.lessonId ?? 'variables';
  const lesson = getLesson(lessonId) ?? PYTHON_LESSONS[0];

  const { avatarState, isConnected, transcript, connect, disconnect, error } =
    useRealtimeAvatarChat();

  const flatListRef = useRef<FlatList<TranscriptEntry>>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (transcript.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [transcript]);

  const handleConnectToggle = useCallback(() => {
    if (isConnected) {
      disconnect();
    } else {
      connect(lessonId);
    }
  }, [isConnected, connect, disconnect, lessonId]);

  // ── Status badge ──────────────────────────────────────────────────────

  const { label: statusLabel, color: statusColor } = STATE_CONFIG[avatarState];

  const isProcessing = !isConnected && !error;

  // ── Connect button config ─────────────────────────────────────────────

  const connectBtnLabel = isConnected ? 'Rozłącz' : 'Połącz z Piko';
  const connectBtnColors: [string, string] = isConnected
    ? ['#EF4444', '#DC2626']
    : [Colors.primary, Colors.primaryLight];

  // ── Render ────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <LinearGradient colors={[Colors.primaryDark, Colors.primary]} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Wróć</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Powtórka z Piko 🐍</Text>
        <Text style={styles.headerSubtitle}>{lesson.title}</Text>
      </LinearGradient>

      {/* Body */}
      <View style={styles.body}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <RiveAvatar avatarState={avatarState} size={220} />

          {/* Status badge */}
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{statusLabel}</Text>
          </View>
        </View>

        {/* Error banner */}
        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        )}

        {/* Transcript */}
        {transcript.length === 0 && !error && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              {isConnected
                ? 'Piko zaraz się przywita... 👋'
                : 'Naciśnij "Połącz z Piko", żeby zacząć powtórkę! 🎯'}
            </Text>
          </View>
        )}

        {transcript.length > 0 && (
          <FlatList
            ref={flatListRef}
            data={transcript}
            keyExtractor={(_, i) => String(i)}
            renderItem={({ item }) => <TranscriptBubble item={item} />}
            contentContainerStyle={styles.transcriptList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Footer: connect/disconnect button */}
      <View style={styles.footer}>
        {avatarState === 'talking' && (
          <View style={styles.talkingIndicator}>
            <ActivityIndicator color={Colors.info} size="small" />
            <Text style={styles.talkingText}>Piko mówi...</Text>
          </View>
        )}

        <TouchableOpacity onPress={handleConnectToggle} activeOpacity={0.85}>
          <LinearGradient colors={connectBtnColors} style={styles.connectBtn}>
            <Text style={styles.connectBtnText}>{connectBtnLabel}</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.footerHint}>
          {isConnected
            ? 'Mów naturalnie — Piko Cię słucha 🎤'
            : 'Potrzebujesz klucza OPENAI_API_KEY w app.json'}
        </Text>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.bg,
  },

  // Header
  header: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  backBtn: {
    marginBottom: Spacing.sm,
  },
  backText: {
    ...Typography.bodyBold,
    color: Colors.textLight,
    opacity: 0.85,
  },
  headerTitle: {
    ...Typography.h2,
    color: Colors.textLight,
  },
  headerSubtitle: {
    ...Typography.body,
    color: Colors.textLight,
    opacity: 0.8,
    marginTop: 2,
  },

  // Body
  body: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },

  // Avatar
  avatarContainer: {
    alignItems: 'center',
    marginTop: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  statusBadge: {
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.round,
  },
  statusText: {
    ...Typography.smallBold,
    color: Colors.textLight,
  },

  // Error
  errorBanner: {
    backgroundColor: '#FEF2F2',
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.error,
    marginBottom: Spacing.md,
  },
  errorText: {
    ...Typography.small,
    color: Colors.error,
    lineHeight: 20,
  },

  // Empty state
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyStateText: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },

  // Transcript
  transcriptList: {
    paddingBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  bubble: {
    maxWidth: '82%',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    ...Shadow.sm,
  },
  bubblePiko: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.bgCard,
    borderBottomLeftRadius: Radius.sm,
  },
  bubbleStudent: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary,
    borderBottomRightRadius: Radius.sm,
  },
  bubbleRole: {
    ...Typography.tiny,
    color: Colors.primary,
    fontWeight: '700',
    marginBottom: 2,
  },
  bubbleText: {
    ...Typography.body,
  },
  bubbleTextPiko: {
    color: Colors.textPrimary,
  },
  bubbleTextStudent: {
    color: Colors.textLight,
  },

  // Footer
  footer: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
    gap: Spacing.sm,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.bgCard,
  },
  talkingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  talkingText: {
    ...Typography.small,
    color: Colors.info,
  },
  connectBtn: {
    borderRadius: Radius.round,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xxl,
    ...Shadow.card,
  },
  connectBtnText: {
    ...Typography.h3,
    color: Colors.textLight,
    textAlign: 'center',
  },
  footerHint: {
    ...Typography.tiny,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: Spacing.lg,
  },
});
