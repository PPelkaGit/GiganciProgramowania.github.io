import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../theme';
import { UserRole } from '../../data/mockData';

interface Props {
  onSelectRole: (role: UserRole) => void;
}

const ROLES: { role: UserRole; emoji: string; colorKey: keyof typeof Colors }[] = [
  { role: 'student', emoji: '🧑‍💻', colorKey: 'student' },
  { role: 'parent', emoji: '👨‍👩‍👧', colorKey: 'parent' },
  { role: 'teacher', emoji: '👨‍🏫', colorKey: 'teacher' },
];

export default function RoleSelectScreen({ onSelectRole }: Props) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<UserRole | null>(null);

  return (
    <LinearGradient colors={[Colors.primaryDark, Colors.primary, Colors.primaryLight]} style={styles.gradient}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        {/* Logo */}
        <View style={styles.logoSection}>
          <Text style={styles.logoEmoji}>🚀</Text>
          <Text style={styles.appName}>{t('app_name')}</Text>
          <Text style={styles.tagline}>Kod. AI. Przyszłość.</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.title}>{t('select_role')}</Text>
          <Text style={styles.subtitle}>{t('select_role_subtitle')}</Text>

          <View style={styles.rolesContainer}>
            {ROLES.map(({ role, emoji, colorKey }) => {
              const color = Colors[colorKey] as string;
              const isSelected = selected === role;
              return (
                <TouchableOpacity
                  key={role}
                  style={[
                    styles.roleCard,
                    isSelected && { borderColor: color, borderWidth: 2.5, backgroundColor: color + '10' }
                  ]}
                  onPress={() => { setSelected(role); onSelectRole(role); }}
                  activeOpacity={0.8}
                >
                  <View style={[styles.roleEmoji, { backgroundColor: color + '18' }]}>
                    <Text style={styles.emojiText}>{emoji}</Text>
                  </View>
                  <Text style={[styles.roleTitle, isSelected && { color }]}>
                    {t(`role_${role}` as any)}
                  </Text>
                  <Text style={styles.roleDesc}>
                    {t(`role_${role}_desc` as any)}
                  </Text>
                  {isSelected && (
                    <View style={[styles.checkBadge, { backgroundColor: color }]}>
                      <Text style={styles.checkText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <Text style={styles.footer}>© 2025 Giganci Programowania</Text>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1, paddingHorizontal: Spacing.lg, justifyContent: 'space-between', paddingVertical: Spacing.xl },
  logoSection: { alignItems: 'center', paddingTop: Spacing.xl },
  logoEmoji: { fontSize: 56, marginBottom: Spacing.sm },
  appName: { ...Typography.h1, color: Colors.textLight, marginBottom: 4 },
  tagline: { color: 'rgba(255,255,255,0.7)', fontSize: 14, letterSpacing: 1 },
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    ...Shadow.card,
  },
  title: { ...Typography.h2, color: Colors.textPrimary, textAlign: 'center', marginBottom: 4 },
  subtitle: { color: Colors.textSecondary, textAlign: 'center', marginBottom: Spacing.lg, fontSize: 14 },
  rolesContainer: { gap: Spacing.sm },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radius.lg,
    backgroundColor: Colors.bg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: Spacing.md,
  },
  roleEmoji: {
    width: 52,
    height: 52,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiText: { fontSize: 26 },
  roleTitle: { ...Typography.h3, color: Colors.textPrimary, flex: 1 },
  roleDesc: { position: 'absolute', display: 'none' }, // Hidden, handled by layout
  checkBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  footer: { color: 'rgba(255,255,255,0.5)', textAlign: 'center', fontSize: 12 },
});
