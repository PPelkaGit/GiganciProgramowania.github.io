import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Radius } from '../theme';

interface Props {
  progress: number; // 0-100
  color?: string;
  height?: number;
  showLabel?: boolean;
  label?: string;
}

export default function ProgressBar({ progress, color = Colors.primary, height = 8, showLabel, label }: Props) {
  return (
    <View>
      {(showLabel || label) && (
        <View style={styles.labelRow}>
          {label && <Text style={styles.label}>{label}</Text>}
          {showLabel && <Text style={[styles.pct, { color }]}>{progress}%</Text>}
        </View>
      )}
      <View style={[styles.track, { height }]}>
        <View style={[styles.fill, { width: `${Math.min(progress, 100)}%`, backgroundColor: color, height }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: '#E5E7EB',
    borderRadius: Radius.round,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: Radius.round,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: { fontSize: 12, color: Colors.textSecondary },
  pct: { fontSize: 12, fontWeight: '700' },
});
