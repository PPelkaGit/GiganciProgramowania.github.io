import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../theme';
import { useApp } from '../../context/AppContext';
import { CHILDREN, PAYMENTS } from '../../data/mockData';
import Card from '../../components/Card';
import ProgressBar from '../../components/ProgressBar';

export default function ParentDashboard() {
  const { t } = useTranslation();
  const { user } = useApp();

  const pendingPayments = PAYMENTS.filter(p => p.status === 'pending');
  const pendingTotal = pendingPayments.reduce((s, p) => s + p.amount, 0);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient colors={[Colors.parent, '#065F46']} style={styles.header}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.greeting}>{t('welcome')},</Text>
              <Text style={styles.userName}>{user?.name?.split(' ')[0]} 👋</Text>
            </View>
            <View style={styles.notifBtn}>
              <Text style={styles.notifEmoji}>🔔</Text>
              <View style={styles.notifDot} />
            </View>
          </View>
          {/* Payment alert */}
          {pendingTotal > 0 && (
            <View style={styles.paymentAlert}>
              <Text style={styles.paymentAlertText}>💳 Oczekujące płatności: {pendingTotal} PLN</Text>
              <TouchableOpacity>
                <Text style={styles.payAlertBtn}>Zapłać →</Text>
              </TouchableOpacity>
            </View>
          )}
        </LinearGradient>

        <View style={styles.content}>
          {/* Children cards */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>👨‍👩‍👧 {t('my_children')}</Text>
              <TouchableOpacity>
                <Text style={styles.seeAll}>{t('see_all')}</Text>
              </TouchableOpacity>
            </View>

            {CHILDREN.map(child => (
              <Card key={child.id} variant="elevated" style={styles.childCard}>
                <View style={styles.childHeader}>
                  <View style={[styles.childAvatar, { backgroundColor: Colors.parent + '20' }]}>
                    <Text style={styles.childAvatarEmoji}>{child.avatar}</Text>
                  </View>
                  <View style={styles.childInfo}>
                    <Text style={styles.childName}>{child.name}</Text>
                    <Text style={styles.childAge}>{child.age} lat • {t('level')} {child.level}</Text>
                  </View>
                  <View style={styles.streakBadge}>
                    <Text style={styles.streakText}>{child.streak}🔥</Text>
                  </View>
                </View>

                {/* Stats */}
                <View style={styles.childStats}>
                  <View style={styles.childStat}>
                    <Text style={styles.childStatValue}>{child.attendance}%</Text>
                    <Text style={styles.childStatLabel}>{t('attendance')}</Text>
                  </View>
                  <View style={styles.childStat}>
                    <Text style={styles.childStatValue}>{child.xp}</Text>
                    <Text style={styles.childStatLabel}>XP</Text>
                  </View>
                  <View style={styles.childStat}>
                    <Text style={styles.childStatValue}>{child.courses.length}</Text>
                    <Text style={styles.childStatLabel}>{t('courses')}</Text>
                  </View>
                </View>

                {/* Attendance bar */}
                <ProgressBar
                  progress={child.attendance}
                  color={child.attendance > 90 ? Colors.success : Colors.warning}
                  height={6}
                  showLabel
                  label={t('attendance')}
                />

                {/* Next class */}
                <View style={styles.nextClassRow}>
                  <Text style={styles.nextClassLabel}>📅 {t('next_class')}:</Text>
                  <Text style={styles.nextClassValue}>{child.nextClass}</Text>
                </View>

                {/* Courses chips */}
                <View style={styles.coursesRow}>
                  {child.courses.map(c => (
                    <View key={c} style={styles.courseChip}>
                      <Text style={styles.courseChipText}>{c}</Text>
                    </View>
                  ))}
                </View>
              </Card>
            ))}
          </View>

          {/* Messages from teachers */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>📩 Wiadomości od nauczycieli</Text>
            {[
              { teacher: 'Pan Tomasz', msg: 'Kacper świetnie poradził sobie z zadaniem domowym!', time: '10:30', read: false },
              { teacher: 'Pani Marta', msg: 'Zosia potrzebuje dodatkowych ćwiczeń ze Scratch.', time: 'Wczoraj', read: true },
            ].map((m, i) => (
              <TouchableOpacity key={i} style={[styles.teacherMsg, !m.read && styles.teacherMsgUnread]}>
                <View style={styles.teacherMsgLeft}>
                  <Text style={styles.teacherEmoji}>👨‍🏫</Text>
                  <View>
                    <Text style={[styles.teacherName, !m.read && { color: Colors.parent }]}>{m.teacher}</Text>
                    <Text style={styles.teacherMsgText} numberOfLines={1}>{m.msg}</Text>
                  </View>
                </View>
                <Text style={styles.msgTime}>{m.time}</Text>
              </TouchableOpacity>
            ))}
          </Card>

          {/* Quick actions */}
          <View style={styles.quickActions}>
            {[
              { label: 'Zapisz\nna kurs', emoji: '📝', color: Colors.parent },
              { label: 'Zapłać', emoji: '💳', color: Colors.warning },
              { label: 'Wiadomość', emoji: '💬', color: Colors.info },
              { label: 'Raport', emoji: '📊', color: Colors.primary },
            ].map(action => (
              <TouchableOpacity key={action.label} style={[styles.quickAction, { borderColor: action.color + '40' }]}>
                <View style={[styles.quickActionIcon, { backgroundColor: action.color + '18' }]}>
                  <Text style={styles.quickActionEmoji}>{action.emoji}</Text>
                </View>
                <Text style={styles.quickActionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, paddingBottom: Spacing.xl },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.md },
  greeting: { color: 'rgba(255,255,255,0.75)', fontSize: 14 },
  userName: { ...Typography.h1, color: '#fff' },
  notifBtn: { position: 'relative', width: 44, height: 44, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  notifEmoji: { fontSize: 22 },
  notifDot: { position: 'absolute', top: 8, right: 8, width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.error, borderWidth: 2, borderColor: Colors.parent },
  paymentAlert: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: Radius.md, padding: 12,
  },
  paymentAlertText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  payAlertBtn: { color: Colors.secondaryLight, fontWeight: '800', fontSize: 13 },
  content: { padding: Spacing.lg, gap: Spacing.lg },
  section: { gap: Spacing.md },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { ...Typography.h3, color: Colors.textPrimary },
  seeAll: { color: Colors.parent, fontSize: 13, fontWeight: '600' },
  childCard: { gap: Spacing.md },
  childHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  childAvatar: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  childAvatarEmoji: { fontSize: 28 },
  childInfo: { flex: 1 },
  childName: { ...Typography.bodyBold, color: Colors.textPrimary },
  childAge: { color: Colors.textSecondary, fontSize: 13 },
  streakBadge: { backgroundColor: Colors.secondary + '20', paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.round },
  streakText: { color: Colors.secondary, fontWeight: '800', fontSize: 13 },
  childStats: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: Colors.bg, borderRadius: Radius.md, padding: Spacing.sm },
  childStat: { alignItems: 'center' },
  childStatValue: { ...Typography.h3, color: Colors.parent },
  childStatLabel: { color: Colors.textMuted, fontSize: 11 },
  nextClassRow: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  nextClassLabel: { color: Colors.textSecondary, fontSize: 12 },
  nextClassValue: { color: Colors.parent, fontSize: 12, fontWeight: '700' },
  coursesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  courseChip: { backgroundColor: Colors.parent + '15', paddingHorizontal: 10, paddingVertical: 3, borderRadius: Radius.round },
  courseChipText: { color: Colors.parent, fontSize: 11, fontWeight: '600' },
  teacherMsg: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.sm },
  teacherMsgUnread: { backgroundColor: Colors.parent + '08', borderRadius: Radius.sm, paddingHorizontal: 8, marginHorizontal: -8 },
  teacherMsgLeft: { flexDirection: 'row', gap: Spacing.sm, flex: 1 },
  teacherEmoji: { fontSize: 24 },
  teacherName: { ...Typography.smallBold, color: Colors.textSecondary, marginBottom: 2 },
  teacherMsgText: { color: Colors.textMuted, fontSize: 12, flex: 1 },
  msgTime: { color: Colors.textMuted, fontSize: 11 },
  quickActions: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.sm },
  quickAction: {
    flex: 1, alignItems: 'center', gap: 6, paddingVertical: Spacing.md,
    backgroundColor: Colors.bgCard, borderRadius: Radius.lg, borderWidth: 1.5,
    ...Shadow.sm,
  },
  quickActionIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  quickActionEmoji: { fontSize: 22 },
  quickActionLabel: { color: Colors.textSecondary, fontSize: 11, fontWeight: '600', textAlign: 'center' },
});
