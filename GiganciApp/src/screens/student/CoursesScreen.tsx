import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../theme';
import { COURSES } from '../../data/mockData';
import ProgressBar from '../../components/ProgressBar';

const FILTERS = ['all', 'enrolled', 'available'] as const;

export default function CoursesScreen() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<typeof FILTERS[number]>('all');

  const filtered = COURSES.filter(c => {
    if (filter === 'enrolled') return c.enrolled;
    if (filter === 'available') return !c.enrolled;
    return true;
  });

  const difficultyColor = (d: string) => {
    if (d === 'beginner') return Colors.success;
    if (d === 'intermediate') return Colors.warning;
    return Colors.error;
  };

  const difficultyLabel = (d: string) => {
    if (d === 'beginner') return t('difficulty_beginner');
    if (d === 'intermediate') return t('difficulty_intermediate');
    return t('difficulty_advanced');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>📚 {t('courses')}</Text>
      </View>

      {/* Filters */}
      <View style={styles.filterRow}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f === 'all' ? '🌟 Wszystkie' : f === 'enrolled' ? '✅ Moje' : '🔍 Dostępne'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {filtered.map(course => (
          <TouchableOpacity key={course.id} activeOpacity={0.9}>
            <View style={[styles.card, Shadow.card]}>
              {/* Top gradient */}
              <LinearGradient colors={[course.color, course.color + 'AA']} style={styles.cardTop}>
                <Text style={styles.cardIcon}>{course.icon}</Text>
                <View style={styles.cardTopRight}>
                  {course.enrolled && (
                    <View style={styles.enrolledBadge}>
                      <Text style={styles.enrolledText}>✓ {t('enrolled')}</Text>
                    </View>
                  )}
                  <View style={[styles.diffBadge, { backgroundColor: difficultyColor(course.difficulty) + '30', borderColor: difficultyColor(course.difficulty) }]}>
                    <Text style={[styles.diffText, { color: difficultyColor(course.difficulty) }]}>
                      {difficultyLabel(course.difficulty)}
                    </Text>
                  </View>
                </View>
              </LinearGradient>

              {/* Card body */}
              <View style={styles.cardBody}>
                <Text style={styles.courseTitle}>{course.title}</Text>
                <Text style={styles.courseSubtitle}>{course.subtitle}</Text>
                <Text style={styles.courseDesc}>{course.description}</Text>

                {/* Tags */}
                <View style={styles.tags}>
                  {course.tags.map(tag => (
                    <View key={tag} style={[styles.tag, { backgroundColor: course.color + '18' }]}>
                      <Text style={[styles.tagText, { color: course.color }]}>{tag}</Text>
                    </View>
                  ))}
                </View>

                {/* Stats */}
                <View style={styles.statsRow}>
                  <Text style={styles.stat}>📖 {course.totalLessons} {t('lessons')}</Text>
                  <Text style={styles.stat}>⏱ {course.hours} {t('hours')}</Text>
                </View>

                {/* Progress */}
                {course.enrolled && (
                  <View style={styles.progressSection}>
                    <ProgressBar
                      progress={course.progress}
                      color={course.color}
                      height={6}
                      showLabel
                      label={`${course.completedLessons}/${course.totalLessons} lekcji`}
                    />
                  </View>
                )}

                {/* CTA */}
                <TouchableOpacity style={[styles.cta, { backgroundColor: course.color }]}>
                  <Text style={styles.ctaText}>
                    {course.enrolled ? `▶ ${t('course_continue')}` : `🚀 ${t('course_start')}`}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, paddingBottom: Spacing.sm },
  title: { ...Typography.h2, color: Colors.textPrimary },
  filterRow: { flexDirection: 'row', paddingHorizontal: Spacing.lg, gap: Spacing.sm, paddingBottom: Spacing.md },
  filterBtn: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: Radius.round,
    backgroundColor: Colors.bgCard, borderWidth: 1.5, borderColor: Colors.border,
  },
  filterBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  filterTextActive: { color: '#fff' },
  scroll: { flex: 1 },
  content: { padding: Spacing.lg, gap: Spacing.lg },
  card: { backgroundColor: Colors.bgCard, borderRadius: Radius.xl, overflow: 'hidden' },
  cardTop: { padding: Spacing.lg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardIcon: { fontSize: 44 },
  cardTopRight: { gap: 8, alignItems: 'flex-end' },
  enrolledBadge: { backgroundColor: 'rgba(255,255,255,0.3)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.round },
  enrolledText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  diffBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.round, borderWidth: 1, backgroundColor: Colors.bgCard },
  diffText: { fontSize: 11, fontWeight: '700' },
  cardBody: { padding: Spacing.lg, gap: 8 },
  courseTitle: { ...Typography.h3, color: Colors.textPrimary },
  courseSubtitle: { color: Colors.textSecondary, fontSize: 13, fontWeight: '600' },
  courseDesc: { color: Colors.textSecondary, fontSize: 13, lineHeight: 19 },
  tags: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  tag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.round },
  tagText: { fontSize: 11, fontWeight: '700' },
  statsRow: { flexDirection: 'row', gap: Spacing.lg },
  stat: { color: Colors.textSecondary, fontSize: 13 },
  progressSection: { marginTop: 4 },
  cta: { paddingVertical: 12, borderRadius: Radius.round, alignItems: 'center', marginTop: 4 },
  ctaText: { color: '#fff', fontWeight: '800', fontSize: 15 },
});
