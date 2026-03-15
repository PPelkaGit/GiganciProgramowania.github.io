import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../theme';
import { useApp } from '../../context/AppContext';
import { SCHEDULE_DATA, TEACHER_STUDENTS } from '../../data/mockData';
import Card from '../../components/Card';
import ProgressBar from '../../components/ProgressBar';

export default function TeacherDashboard() {
  const { t } = useTranslation();
  const { user } = useApp();

  const todayClasses = SCHEDULE_DATA.filter(s => s.day === 0);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient colors={[Colors.teacher, '#7F1D1D']} style={styles.header}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.greeting}>Panel nauczyciela</Text>
              <Text style={styles.userName}>{user?.name} 👋</Text>
            </View>
            <View style={styles.notifBtn}>
              <Text style={styles.notifEmoji}>🔔</Text>
            </View>
          </View>

          {/* Quick stats */}
          <View style={styles.statsRow}>
            {[
              { val: `${TEACHER_STUDENTS.length}`, label: t('total_students'), emoji: '👥' },
              { val: '89%', label: t('avg_attendance'), emoji: '📊' },
              { val: '3', label: t('assignments_due'), emoji: '📝' },
              { val: '2', label: 'Zajęcia dziś', emoji: '📅' },
            ].map(s => (
              <View key={s.label} style={styles.statItem}>
                <Text style={styles.statEmoji}>{s.emoji}</Text>
                <Text style={styles.statVal}>{s.val}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {/* Today's classes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📅 {t('class_today')}</Text>
            {todayClasses.map(cls => (
              <Card key={cls.id} style={{ ...styles.classCard, borderLeftColor: cls.color, borderLeftWidth: 4 } as any}>
                <View style={styles.classTop}>
                  <View>
                    <Text style={styles.classSubject}>{cls.subject}</Text>
                    <Text style={styles.classMeta}>🕐 {cls.time}–{cls.endTime}  •  {cls.isOnline ? '🌐 Online' : `🏫 ${cls.room}`}</Text>
                  </View>
                  <View style={styles.classActions}>
                    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: cls.color + '20' }]}>
                      <Text style={[styles.actionBtnText, { color: cls.color }]}>Lista</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.classAttendance}>
                  <Text style={styles.attendanceLabel}>Frekwencja: 8/10 uczniów</Text>
                  <ProgressBar progress={80} color={cls.color} height={5} />
                </View>
              </Card>
            ))}
          </View>

          {/* Student list preview */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>👥 {t('my_students')}</Text>
              <TouchableOpacity><Text style={styles.seeAll}>{t('see_all')}</Text></TouchableOpacity>
            </View>
            {TEACHER_STUDENTS.slice(0, 4).map(s => (
              <Card key={s.id} style={styles.studentRow}>
                <View style={[styles.studentAvatar, { backgroundColor: Colors.teacher + '18' }]}>
                  <Text style={styles.studentAvatarEmoji}>{s.avatar}</Text>
                </View>
                <View style={styles.studentInfo}>
                  <Text style={styles.studentName}>{s.name}</Text>
                  <Text style={styles.studentMeta}>{s.age} lat • {s.course}</Text>
                </View>
                <View style={styles.studentRight}>
                  <View style={[styles.gradeBadge, { backgroundColor: s.grade >= 4 ? Colors.success + '20' : Colors.warning + '20' }]}>
                    <Text style={[styles.gradeText, { color: s.grade >= 4 ? Colors.success : Colors.warning }]}>
                      {s.grade}/5
                    </Text>
                  </View>
                  <Text style={styles.studentAttendance}>{s.attendance}%</Text>
                </View>
              </Card>
            ))}
          </View>

          {/* Quick actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⚡ Szybkie akcje</Text>
            <View style={styles.actionsGrid}>
              {[
                { label: 'Oznacz obecność', emoji: '✅', color: Colors.success },
                { label: 'Dodaj zadanie', emoji: '📝', color: Colors.teacher },
                { label: 'Wyślij wiadomość', emoji: '💬', color: Colors.info },
                { label: 'Dodaj ocenę', emoji: '⭐', color: Colors.secondary },
                { label: 'Plan zajęć', emoji: '📅', color: Colors.primary },
                { label: 'Materiały', emoji: '📚', color: '#8B5CF6' },
              ].map(a => (
                <TouchableOpacity key={a.label} style={[styles.actionCard, { borderColor: a.color + '30' }]}>
                  <View style={[styles.actionIcon, { backgroundColor: a.color + '18' }]}>
                    <Text style={styles.actionEmoji}>{a.emoji}</Text>
                  </View>
                  <Text style={styles.actionLabel}>{a.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, paddingBottom: Spacing.xl },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.lg },
  greeting: { color: 'rgba(255,255,255,0.75)', fontSize: 14 },
  userName: { ...Typography.h1, color: '#fff' },
  notifBtn: { width: 44, height: 44, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  notifEmoji: { fontSize: 22 },
  statsRow: {
    flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: Radius.lg, padding: Spacing.md, justifyContent: 'space-around',
  },
  statItem: { alignItems: 'center', gap: 2 },
  statEmoji: { fontSize: 18 },
  statVal: { color: '#fff', fontSize: 18, fontWeight: '800' },
  statLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 10, textAlign: 'center' },
  content: { padding: Spacing.lg, gap: Spacing.lg },
  section: { gap: Spacing.sm },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { ...Typography.h3, color: Colors.textPrimary },
  seeAll: { color: Colors.teacher, fontSize: 13, fontWeight: '600' },
  classCard: { gap: Spacing.sm },
  classTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  classSubject: { ...Typography.bodyBold, color: Colors.textPrimary, marginBottom: 4 },
  classMeta: { color: Colors.textSecondary, fontSize: 12 },
  classActions: {},
  actionBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.round },
  actionBtnText: { fontSize: 12, fontWeight: '700' },
  classAttendance: { gap: 4 },
  attendanceLabel: { color: Colors.textSecondary, fontSize: 12 },
  studentRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: 12 },
  studentAvatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  studentAvatarEmoji: { fontSize: 22 },
  studentInfo: { flex: 1 },
  studentName: { ...Typography.bodyBold, color: Colors.textPrimary },
  studentMeta: { color: Colors.textSecondary, fontSize: 12 },
  studentRight: { alignItems: 'flex-end', gap: 4 },
  gradeBadge: { paddingHorizontal: 10, paddingVertical: 2, borderRadius: Radius.round },
  gradeText: { fontSize: 13, fontWeight: '800' },
  studentAttendance: { color: Colors.textMuted, fontSize: 11 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  actionCard: {
    width: '30.5%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.bgCard, borderRadius: Radius.lg, borderWidth: 1.5,
    gap: 6, ...Shadow.sm,
  },
  actionIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  actionEmoji: { fontSize: 22 },
  actionLabel: { color: Colors.textSecondary, fontSize: 10, fontWeight: '600', textAlign: 'center' },
});
