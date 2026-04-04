import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../theme';
import { useApp } from '../../context/AppContext';
import { SCHEDULE_DATA, COURSES, ACHIEVEMENTS } from '../../data/mockData';
import Card from '../../components/Card';
import ProgressBar from '../../components/ProgressBar';
import { LAST_COMPLETED_LESSON_ID } from '../../data/pythonCurriculum';

export default function StudentDashboard() {
  const { t } = useTranslation();
  const { user } = useApp();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigation = useNavigation<any>();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? t('good_morning') : hour < 18 ? t('good_afternoon') : t('good_evening');
  const todayClasses = SCHEDULE_DATA.filter(s => s.day === 0); // Monday
  const myCourses = COURSES.filter(c => c.enrolled);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header gradient */}
        <LinearGradient colors={[Colors.primaryDark, Colors.primary]} style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>{greeting},</Text>
              <Text style={styles.userName}>{user?.name?.split(' ')[0]} 👋</Text>
            </View>
            <View style={styles.xpBadge}>
              <Text style={styles.xpEmoji}>⚡</Text>
              <Text style={styles.xpText}>{user?.xp} XP</Text>
            </View>
          </View>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user?.level}</Text>
              <Text style={styles.statLabel}>{t('level')}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user?.streak}🔥</Text>
              <Text style={styles.statLabel}>{t('streak_days')}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>16</Text>
              <Text style={styles.statLabel}>{t('completed_lessons')}</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {/* Level progress */}
          <Card style={styles.levelCard}>
            <View style={styles.levelHeader}>
              <Text style={styles.sectionTitle}>⭐ Level {user?.level} → {(user?.level || 0) + 1}</Text>
              <Text style={styles.xpSmall}>{user?.xp} / 4000 XP</Text>
            </View>
            <ProgressBar progress={Math.round(((user?.xp || 0) % 1000) / 10)} color={Colors.secondary} height={10} />
          </Card>

          {/* Today's classes */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>📅 {t('todays_classes')}</Text>
              <TouchableOpacity><Text style={styles.seeAll}>{t('see_all')}</Text></TouchableOpacity>
            </View>
            {todayClasses.map(cls => (
              <Card key={cls.id} style={styles.classCard}>
                <View style={[styles.classColorBar, { backgroundColor: cls.color }]} />
                <View style={styles.classInfo}>
                  <Text style={styles.classSubject}>{cls.subject}</Text>
                  <Text style={styles.classMeta}>🕐 {cls.time} – {cls.endTime}  •  {cls.isOnline ? '🌐 Online' : `🏫 ${cls.room}`}</Text>
                  <Text style={styles.classTeacher}>👨‍🏫 {cls.teacher}</Text>
                </View>
                {cls.isOnline && (
                  <TouchableOpacity style={[styles.joinBtn, { backgroundColor: cls.color }]}>
                    <Text style={styles.joinText}>Dołącz</Text>
                  </TouchableOpacity>
                )}
              </Card>
            ))}
          </View>

          {/* Continue learning */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>📚 {t('continue_learning')}</Text>
              <TouchableOpacity><Text style={styles.seeAll}>{t('see_all')}</Text></TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {myCourses.map(course => (
                <TouchableOpacity key={course.id} activeOpacity={0.9}>
                  <LinearGradient colors={[course.color, course.color + 'CC']} style={styles.courseCard}>
                    <Text style={styles.courseIcon}>{course.icon}</Text>
                    <Text style={styles.courseTitle}>{course.title}</Text>
                    <Text style={styles.courseProgress}>{course.completedLessons}/{course.totalLessons} lekcji</Text>
                    <View style={styles.courseProgressBar}>
                      <View style={[styles.courseProgressFill, { width: `${course.progress}%` }]} />
                    </View>
                    <Text style={styles.courseProgressPct}>{course.progress}%</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Avatar Review — Powtórka z Piko */}
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => navigation.navigate('AvatarReview', { lessonId: LAST_COMPLETED_LESSON_ID })}
          >
            <LinearGradient colors={['#4C1D95', '#6C3CE1']} style={styles.pikoCard}>
              <View style={styles.pikoLeft}>
                <Text style={styles.pikoEmoji}>🤖</Text>
                <View>
                  <Text style={styles.pikoTitle}>Powtórka z Piko</Text>
                  <Text style={styles.pikoSubtitle}>Zmienne i typy danych 🐍</Text>
                </View>
              </View>
              <Text style={styles.pikoArrow}>›</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Achievements */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🏆 {t('achievements')}</Text>
            <View style={styles.achievementsRow}>
              {ACHIEVEMENTS.map(a => (
                <View key={a.id} style={[styles.achievement, !a.earned && styles.achievementLocked]}>
                  <Text style={[styles.achievementIcon, !a.earned && styles.lockedIcon]}>{a.icon}</Text>
                  <Text style={[styles.achievementTitle, !a.earned && styles.lockedText]}>{a.title}</Text>
                </View>
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
  scroll: { flex: 1 },
  header: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, paddingBottom: Spacing.xl + 8 },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.lg },
  greeting: { color: 'rgba(255,255,255,0.75)', fontSize: 14 },
  userName: { ...Typography.h1, color: '#fff' },
  xpBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.round,
  },
  xpEmoji: { fontSize: 16 },
  xpText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  statsRow: {
    flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: Radius.lg, padding: Spacing.md, justifyContent: 'space-around',
  },
  statItem: { alignItems: 'center' },
  statValue: { color: '#fff', fontSize: 20, fontWeight: '800' },
  statLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 11, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.25)' },
  content: { padding: Spacing.lg, gap: Spacing.lg },
  levelCard: { gap: Spacing.sm },
  levelHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  xpSmall: { color: Colors.textSecondary, fontSize: 12 },
  section: { gap: Spacing.sm },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { ...Typography.h3, color: Colors.textPrimary },
  seeAll: { color: Colors.primary, fontSize: 13, fontWeight: '600' },
  classCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: 12, overflow: 'hidden' },
  classColorBar: { width: 4, height: '100%', borderRadius: 2, position: 'absolute', left: 0, top: 0, bottom: 0 },
  classInfo: { flex: 1, paddingLeft: 8 },
  classSubject: { ...Typography.bodyBold, color: Colors.textPrimary, marginBottom: 2 },
  classMeta: { color: Colors.textSecondary, fontSize: 12, marginBottom: 2 },
  classTeacher: { color: Colors.textSecondary, fontSize: 12 },
  joinBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.round },
  joinText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  horizontalScroll: { marginHorizontal: -Spacing.lg, paddingHorizontal: Spacing.lg },
  courseCard: {
    width: 160, borderRadius: Radius.lg, padding: Spacing.md, marginRight: Spacing.sm,
    ...Shadow.card,
  },
  courseIcon: { fontSize: 32, marginBottom: Spacing.sm },
  courseTitle: { color: '#fff', fontSize: 13, fontWeight: '700', marginBottom: 4 },
  courseProgress: { color: 'rgba(255,255,255,0.8)', fontSize: 11, marginBottom: 6 },
  courseProgressBar: { height: 4, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2, overflow: 'hidden' },
  courseProgressFill: { height: 4, backgroundColor: '#fff', borderRadius: 2 },
  courseProgressPct: { color: '#fff', fontSize: 11, fontWeight: '700', marginTop: 4 },
  achievementsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  achievement: {
    alignItems: 'center', padding: Spacing.sm,
    backgroundColor: Colors.bgCard, borderRadius: Radius.md, width: 68,
    ...Shadow.sm,
  },
  achievementLocked: { backgroundColor: Colors.bg, opacity: 0.5 },
  achievementIcon: { fontSize: 26, marginBottom: 4 },
  lockedIcon: { opacity: 0.3 },
  achievementTitle: { color: Colors.textSecondary, fontSize: 9, textAlign: 'center', fontWeight: '600' },
  lockedText: { color: Colors.textMuted },

  // Piko avatar review card
  pikoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    ...Shadow.card,
  },
  pikoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  pikoEmoji: { fontSize: 38 },
  pikoTitle: { ...Typography.bodyBold, color: Colors.textLight },
  pikoSubtitle: { ...Typography.small, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  pikoArrow: { color: 'rgba(255,255,255,0.8)', fontSize: 28, fontWeight: '300' },
});
