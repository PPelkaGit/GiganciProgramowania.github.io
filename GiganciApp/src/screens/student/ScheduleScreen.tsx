import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors, Typography, Spacing, Radius } from '../../theme';
import { SCHEDULE_DATA } from '../../data/mockData';
import Card from '../../components/Card';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export default function ScheduleScreen() {
  const { t } = useTranslation();
  const [selectedDay, setSelectedDay] = useState(0);

  const dayClasses = SCHEDULE_DATA.filter(s => s.day === selectedDay);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>📅 {t('schedule')}</Text>
      </View>

      {/* Day picker */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayPicker} contentContainerStyle={styles.dayPickerContent}>
        {DAYS.slice(0, 5).map((day, idx) => {
          const isSelected = selectedDay === idx;
          const isToday = idx === 0; // Monday = today for demo
          return (
            <TouchableOpacity
              key={day}
              onPress={() => setSelectedDay(idx)}
              style={[styles.dayBtn, isSelected && styles.dayBtnSelected]}
              activeOpacity={0.8}
            >
              <Text style={[styles.dayLabel, isSelected && styles.dayLabelSelected]}>
                {t(day as any)}
              </Text>
              <Text style={[styles.dayNum, isSelected && styles.dayNumSelected]}>
                {15 + idx}
              </Text>
              {isToday && <View style={[styles.todayDot, isSelected && styles.todayDotSelected]} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {dayClasses.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🌟</Text>
            <Text style={styles.emptyText}>{t('no_classes_today')}</Text>
          </View>
        ) : (
          dayClasses.map(cls => (
            <View key={cls.id} style={styles.timelineItem}>
              {/* Time */}
              <View style={styles.timeColumn}>
                <Text style={styles.time}>{cls.time}</Text>
                <View style={[styles.timelineLine, { backgroundColor: cls.color }]} />
                <Text style={styles.timeEnd}>{cls.endTime}</Text>
              </View>

              {/* Class card */}
              <Card style={{ ...styles.classCard, borderLeftColor: cls.color, borderLeftWidth: 4 } as any}>
                <View style={styles.classHeader}>
                  <Text style={styles.className}>{cls.subject}</Text>
                  {cls.isOnline ? (
                    <View style={[styles.tag, { backgroundColor: Colors.info + '20' }]}>
                      <Text style={[styles.tagText, { color: Colors.info }]}>🌐 Online</Text>
                    </View>
                  ) : (
                    <View style={[styles.tag, { backgroundColor: cls.color + '20' }]}>
                      <Text style={[styles.tagText, { color: cls.color }]}>🏫 {cls.room}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.classTeacher}>👨‍🏫 {cls.teacher}</Text>
                <Text style={styles.classDuration}>⏱ {cls.time} – {cls.endTime}</Text>
                {cls.isOnline && (
                  <TouchableOpacity style={[styles.joinBtn, { backgroundColor: cls.color }]}>
                    <Text style={styles.joinText}>🎯 Dołącz do lekcji</Text>
                  </TouchableOpacity>
                )}
              </Card>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, paddingBottom: Spacing.sm },
  title: { ...Typography.h2, color: Colors.textPrimary },
  dayPicker: { flexGrow: 0 },
  dayPickerContent: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, gap: Spacing.sm },
  dayBtn: {
    width: 56, height: 72, borderRadius: Radius.lg,
    backgroundColor: Colors.bgCard, alignItems: 'center', justifyContent: 'center',
    gap: 4, borderWidth: 1.5, borderColor: Colors.border,
  },
  dayBtnSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  dayLabel: { color: Colors.textSecondary, fontSize: 12, fontWeight: '600', textTransform: 'uppercase' },
  dayLabelSelected: { color: 'rgba(255,255,255,0.8)' },
  dayNum: { color: Colors.textPrimary, fontSize: 20, fontWeight: '800' },
  dayNumSelected: { color: '#fff' },
  todayDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.primary },
  todayDotSelected: { backgroundColor: '#fff' },
  scroll: { flex: 1 },
  content: { padding: Spacing.lg, gap: Spacing.md },
  timelineItem: { flexDirection: 'row', gap: Spacing.md },
  timeColumn: { width: 52, alignItems: 'center' },
  time: { color: Colors.textSecondary, fontSize: 12, fontWeight: '700' },
  timelineLine: { width: 2, flex: 1, marginVertical: 4, borderRadius: 1, minHeight: 20 },
  timeEnd: { color: Colors.textMuted, fontSize: 11 },
  classCard: { flex: 1, gap: 6 },
  classHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  className: { ...Typography.bodyBold, color: Colors.textPrimary, flex: 1 },
  tag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.round },
  tagText: { fontSize: 11, fontWeight: '700' },
  classTeacher: { color: Colors.textSecondary, fontSize: 13 },
  classDuration: { color: Colors.textMuted, fontSize: 12 },
  joinBtn: {
    paddingVertical: 8, paddingHorizontal: 16, borderRadius: Radius.round,
    alignSelf: 'flex-start', marginTop: 4,
  },
  joinText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyEmoji: { fontSize: 64, marginBottom: Spacing.md },
  emptyText: { ...Typography.h3, color: Colors.textSecondary },
});
