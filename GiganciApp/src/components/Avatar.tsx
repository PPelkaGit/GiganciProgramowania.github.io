import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Radius } from '../theme';

interface Props {
  emoji?: string;
  name?: string;
  size?: number;
  color?: string;
}

export default function Avatar({ emoji, name, size = 44, color = Colors.primary }: Props) {
  const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';
  const fontSize = size * 0.45;

  return (
    <View style={[
      styles.container,
      { width: size, height: size, borderRadius: size / 2, backgroundColor: emoji ? 'transparent' : color + '20' }
    ]}>
      <Text style={{ fontSize: emoji ? size * 0.6 : fontSize, color: emoji ? undefined : color, fontWeight: '700' }}>
        {emoji || initials}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
