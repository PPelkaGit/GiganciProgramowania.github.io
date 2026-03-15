import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Radius, Spacing } from '../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export default function Button({
  title, onPress, variant = 'primary', size = 'md',
  loading, disabled, style, textStyle, fullWidth,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const content = (
    <>
      {loading && <ActivityIndicator size="small" color={variant === 'primary' ? '#fff' : Colors.primary} style={{ marginRight: 8 }} />}
      <Text style={[
        styles.text,
        styles[`text_${size}` as keyof typeof styles] as TextStyle,
        variant === 'outline' ? { color: Colors.primary } : {},
        variant === 'ghost' ? { color: Colors.primary } : {},
        isDisabled && { opacity: 0.6 },
        textStyle,
      ]}>
        {title}
      </Text>
    </>
  );

  if (variant === 'primary') {
    return (
      <TouchableOpacity onPress={onPress} disabled={isDisabled} style={[fullWidth && { width: '100%' }, style]} activeOpacity={0.85}>
        <LinearGradient
          colors={isDisabled ? ['#9CA3AF', '#9CA3AF'] : [Colors.primaryLight, Colors.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.base, styles[size], styles.row]}
        >
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[
        styles.base,
        styles[size],
        styles.row,
        variant === 'secondary' && styles.secondary,
        variant === 'outline' && styles.outline,
        variant === 'ghost' && styles.ghost,
        isDisabled && { opacity: 0.5 },
        fullWidth && { width: '100%' },
        style,
      ]}
    >
      {content}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: Radius.round, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row' },
  sm: { paddingVertical: 8, paddingHorizontal: 16 },
  md: { paddingVertical: 14, paddingHorizontal: 24 },
  lg: { paddingVertical: 18, paddingHorizontal: 32 },
  secondary: { backgroundColor: Colors.secondary },
  outline: { borderWidth: 2, borderColor: Colors.primary, backgroundColor: 'transparent' },
  ghost: { backgroundColor: 'transparent' },
  text: { color: Colors.textLight, fontWeight: '700' },
  text_sm: { fontSize: 13 },
  text_md: { fontSize: 15 },
  text_lg: { fontSize: 17 },
});
