import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../theme';
import { useApp } from '../../context/AppContext';
import { LANGUAGES } from '../../i18n';
import i18n from '../../i18n';
import Card from '../../components/Card';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { user, logout, language, setLanguage } = useApp();

  const handleLangChange = (code: string) => {
    setLanguage(code);
    i18n.changeLanguage(code);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile header */}
        <LinearGradient colors={[Colors.primaryDark, Colors.primary]} style={styles.profileHeader}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarEmoji}>🧑‍💻</Text>
          </View>
          <Text style={styles.profileName}>{user?.name}</Text>
          <Text style={styles.profileEmail}>{user?.email}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{t(`role_${user?.role}` as any)}</Text>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {/* Stats */}
          {user?.role === 'student' && (
            <View style={styles.statsRow}>
              {[
                { value: `${user.level}`, label: t('level'), emoji: '⭐' },
                { value: `${user.xp}`, label: t('xp_points'), emoji: '⚡' },
                { value: `${user.streak}`, label: t('streak_days'), emoji: '🔥' },
              ].map(s => (
                <Card key={s.label} style={styles.statCard}>
                  <Text style={styles.statEmoji}>{s.emoji}</Text>
                  <Text style={styles.statValue}>{s.value}</Text>
                  <Text style={styles.statLabel}>{s.label}</Text>
                </Card>
              ))}
            </View>
          )}

          {/* Language */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>🌍 {t('language')}</Text>
            <View style={styles.langGrid}>
              {LANGUAGES.map(lang => (
                <TouchableOpacity
                  key={lang.code}
                  onPress={() => handleLangChange(lang.code)}
                  style={[styles.langBtn, language === lang.code && styles.langBtnActive]}
                >
                  <Text style={styles.langFlag}>{lang.flag}</Text>
                  <Text style={[styles.langLabel, language === lang.code && styles.langLabelActive]}>
                    {lang.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>

          {/* Settings */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>⚙️ {t('settings')}</Text>
            {[
              { label: t('notifications'), emoji: '🔔', hasToggle: true },
              { label: t('privacy'), emoji: '🔒', hasToggle: false },
              { label: t('help'), emoji: '❓', hasToggle: false },
              { label: t('about'), emoji: 'ℹ️', hasToggle: false },
            ].map(item => (
              <TouchableOpacity key={item.label} style={styles.settingRow}>
                <Text style={styles.settingEmoji}>{item.emoji}</Text>
                <Text style={styles.settingLabel}>{item.label}</Text>
                {item.hasToggle ? (
                  <Switch value={true} onValueChange={() => {}} trackColor={{ true: Colors.primary }} />
                ) : (
                  <Text style={styles.chevron}>›</Text>
                )}
              </TouchableOpacity>
            ))}
          </Card>

          {/* App version */}
          <Text style={styles.version}>{t('app_name')} v1.0.0 (POC)</Text>

          {/* Logout */}
          <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
            <Text style={styles.logoutText}>🚪 {t('logout')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  profileHeader: { paddingVertical: Spacing.xl + 8, alignItems: 'center', gap: Spacing.sm },
  avatarCircle: {
    width: 84, height: 84, borderRadius: 42,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 4,
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.5)',
  },
  avatarEmoji: { fontSize: 42 },
  profileName: { ...Typography.h2, color: '#fff' },
  profileEmail: { color: 'rgba(255,255,255,0.7)', fontSize: 14 },
  roleBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 16,
    paddingVertical: 4, borderRadius: Radius.round,
  },
  roleText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  content: { padding: Spacing.lg, gap: Spacing.md },
  statsRow: { flexDirection: 'row', gap: Spacing.sm },
  statCard: { flex: 1, alignItems: 'center', gap: 2, padding: 12 },
  statEmoji: { fontSize: 20 },
  statValue: { ...Typography.h2, color: Colors.primary },
  statLabel: { color: Colors.textSecondary, fontSize: 11, textAlign: 'center' },
  section: { gap: Spacing.sm },
  sectionTitle: { ...Typography.h3, color: Colors.textPrimary, marginBottom: 4 },
  langGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  langBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radius.round,
    borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.bg,
  },
  langBtnActive: { backgroundColor: Colors.primary + '18', borderColor: Colors.primary },
  langFlag: { fontSize: 20 },
  langLabel: { color: Colors.textSecondary, fontSize: 13, fontWeight: '600' },
  langLabelActive: { color: Colors.primary },
  settingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm, gap: Spacing.md },
  settingEmoji: { fontSize: 22, width: 32 },
  settingLabel: { flex: 1, ...Typography.body, color: Colors.textPrimary },
  chevron: { color: Colors.textMuted, fontSize: 22, fontWeight: '300' },
  version: { textAlign: 'center', color: Colors.textMuted, fontSize: 12 },
  logoutBtn: {
    backgroundColor: Colors.error + '12', borderRadius: Radius.lg,
    paddingVertical: Spacing.md, alignItems: 'center',
    borderWidth: 1.5, borderColor: Colors.error + '40',
  },
  logoutText: { color: Colors.error, fontWeight: '700', fontSize: 15 },
});
