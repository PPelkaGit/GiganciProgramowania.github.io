import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../theme';
import { PAYMENTS } from '../../data/mockData';
import Card from '../../components/Card';

const STATUS_CONFIG = {
  paid: { color: Colors.success, bg: Colors.success + '18', label: '✅ Zapłacono', icon: '✓' },
  pending: { color: Colors.warning, bg: Colors.warning + '18', label: '⏳ Oczekuje', icon: '!' },
  overdue: { color: Colors.error, bg: Colors.error + '18', label: '❌ Zaległe', icon: '×' },
};

export default function PaymentsScreen() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<'all' | 'pending' | 'paid'>('all');

  const filtered = PAYMENTS.filter(p => filter === 'all' || p.status === filter);
  const total = PAYMENTS.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>💳 {t('payment_history')}</Text>
      </View>

      {/* Summary card */}
      {total > 0 && (
        <View style={styles.summaryCard}>
          <View>
            <Text style={styles.summaryLabel}>Do zapłaty</Text>
            <Text style={styles.summaryAmount}>{total} PLN</Text>
          </View>
          <TouchableOpacity style={styles.payAllBtn}>
            <Text style={styles.payAllText}>Zapłać wszystkie</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Filter */}
      <View style={styles.filterRow}>
        {(['all', 'pending', 'paid'] as const).map(f => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f === 'all' ? '📋 Wszystkie' : f === 'pending' ? '⏳ Oczekuje' : '✅ Zapłacone'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {filtered.map(payment => {
          const cfg = STATUS_CONFIG[payment.status as keyof typeof STATUS_CONFIG];
          return (
            <Card key={payment.id} style={styles.paymentCard}>
              <View style={styles.paymentHeader}>
                <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
                  <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
                </View>
                <Text style={[styles.amount, { color: payment.status === 'pending' ? Colors.warning : Colors.textPrimary }]}>
                  {payment.amount} {payment.currency}
                </Text>
              </View>
              <Text style={styles.paymentDesc}>{payment.description}</Text>
              <View style={styles.paymentMeta}>
                <Text style={styles.paymentChild}>👦 {payment.child}</Text>
                <Text style={styles.paymentDate}>📅 {payment.date}</Text>
              </View>
              {payment.status === 'pending' && (
                <TouchableOpacity style={styles.payBtn}>
                  <Text style={styles.payBtnText}>💳 Zapłać teraz</Text>
                </TouchableOpacity>
              )}
              {payment.status === 'paid' && (
                <TouchableOpacity style={styles.invoiceBtn}>
                  <Text style={styles.invoiceBtnText}>📄 Pobierz fakturę</Text>
                </TouchableOpacity>
              )}
            </Card>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, paddingBottom: Spacing.sm },
  title: { ...Typography.h2, color: Colors.textPrimary },
  summaryCard: {
    marginHorizontal: Spacing.lg, marginBottom: Spacing.md,
    backgroundColor: Colors.warning,
    borderRadius: Radius.lg, padding: Spacing.lg,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    ...Shadow.card,
  },
  summaryLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 13 },
  summaryAmount: { color: '#fff', fontSize: 28, fontWeight: '800' },
  payAllBtn: {
    backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 16,
    paddingVertical: 10, borderRadius: Radius.round,
  },
  payAllText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  filterRow: { flexDirection: 'row', paddingHorizontal: Spacing.lg, gap: Spacing.sm, paddingBottom: Spacing.md },
  filterBtn: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: Radius.round,
    backgroundColor: Colors.bgCard, borderWidth: 1.5, borderColor: Colors.border,
  },
  filterBtnActive: { backgroundColor: Colors.parent, borderColor: Colors.parent },
  filterText: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary },
  filterTextActive: { color: '#fff' },
  scroll: { flex: 1 },
  content: { padding: Spacing.lg, gap: Spacing.md },
  paymentCard: { gap: Spacing.sm },
  paymentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.round },
  statusText: { fontSize: 12, fontWeight: '700' },
  amount: { fontSize: 20, fontWeight: '800' },
  paymentDesc: { ...Typography.bodyBold, color: Colors.textPrimary },
  paymentMeta: { flexDirection: 'row', gap: Spacing.lg },
  paymentChild: { color: Colors.textSecondary, fontSize: 13 },
  paymentDate: { color: Colors.textSecondary, fontSize: 13 },
  payBtn: {
    backgroundColor: Colors.warning, borderRadius: Radius.round,
    paddingVertical: 10, alignItems: 'center',
  },
  payBtnText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  invoiceBtn: {
    borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.round,
    paddingVertical: 8, alignItems: 'center',
  },
  invoiceBtnText: { color: Colors.textSecondary, fontWeight: '600', fontSize: 13 },
});
