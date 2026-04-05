/**
 * RiveAvatar — Animated avatar component powered by Rive.
 *
 * ═══════════════════════════════════════════════════════════════════
 * HOW TO ADD THE .riv FILE (Rive animation asset):
 *
 * 1. Go to https://rive.app/community and search for a character
 *    (keywords: "character", "mascot", "robot", "owl").
 *    Pick one with a free license.
 *
 * 2. In Rive editor, create a State Machine named "AvatarSM" with:
 *    - 4 states: idle, talking, listening, thinking
 *    - 3 Boolean inputs:
 *        • isTalking   → transitions to "talking" state
 *        • isListening → transitions to "listening" state
 *        • isThinking  → transitions to "thinking" state
 *    - When all inputs are false → "idle" state
 *
 * 3. Export the file as: GiganciApp/assets/avatar.riv
 *
 * Until the .riv file is present the component renders a
 * gradient circle fallback so the app never crashes.
 * ═══════════════════════════════════════════════════════════════════
 */

import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { AvatarState } from '../services/realtimeService';

// Attempt to import Rive — if the package or asset is missing we use the fallback.
let RiveComponent: React.ComponentType<{
  resourceName: string;
  stateMachineName: string;
  style?: object;
  onStateChanged?: (stateMachineName: string, stateName: string) => void;
}> | null = null;

let useRiveRef: (() => unknown) | null = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const riveModule = require('@rive-app/react-native');
  RiveComponent = riveModule.Rive;
  useRiveRef = riveModule.useRive;
} catch {
  // Package not installed — fallback active
}

// ─── Types ─────────────────────────────────────────────────────────────────

interface RiveAvatarProps {
  avatarState: AvatarState;
  size?: number;
}

// ─── Gradient Fallback ─────────────────────────────────────────────────────

const STATE_CONFIG: Record<AvatarState, { emoji: string; color: string; label: string }> = {
  idle:      { emoji: '🤖', color: '#6C3CE1', label: 'Gotowy' },
  listening: { emoji: '👂', color: '#10B981', label: 'Słucha...' },
  thinking:  { emoji: '🤔', color: '#F59E0B', label: 'Myśli...' },
  talking:   { emoji: '💬', color: '#3B82F6', label: 'Mówi...' },
};

function GradientFallback({ avatarState, size = 220 }: RiveAvatarProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    if (avatarState === 'talking') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, { toValue: 1.06, duration: 400, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(scaleAnim, { toValue: 1,    duration: 400, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ])
      ).start();
    } else if (avatarState === 'listening') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacityAnim, { toValue: 1,   duration: 600, useNativeDriver: true }),
          Animated.timing(opacityAnim, { toValue: 0.5, duration: 600, useNativeDriver: true }),
        ])
      ).start();
    } else if (avatarState === 'thinking') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, { toValue: 0.97, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(scaleAnim, { toValue: 1.03, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ])
      ).start();
    } else {
      scaleAnim.stopAnimation();
      opacityAnim.stopAnimation();
      scaleAnim.setValue(1);
      opacityAnim.setValue(0.7);
    }
  }, [avatarState, scaleAnim, opacityAnim]);

  const { emoji, color } = STATE_CONFIG[avatarState];

  return (
    <Animated.View
      style={[
        styles.fallbackCircle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <Text style={[styles.fallbackEmoji, { fontSize: size * 0.35 }]}>{emoji}</Text>
    </Animated.View>
  );
}

// ─── Rive Wrapper ──────────────────────────────────────────────────────────

function RiveWrapper({ avatarState, size = 220 }: RiveAvatarProps) {
  // We use an imperative ref approach compatible with @rive-app/react-native v9+
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const riveRef = useRef<any>(null);

  useEffect(() => {
    if (!riveRef.current) return;
    try {
      riveRef.current.setBooleanStateAtPath('isTalking',   avatarState === 'talking',   'AvatarSM');
      riveRef.current.setBooleanStateAtPath('isListening', avatarState === 'listening', 'AvatarSM');
      riveRef.current.setBooleanStateAtPath('isThinking',  avatarState === 'thinking',  'AvatarSM');
    } catch {
      // State machine inputs not set up yet — ignore
    }
  }, [avatarState]);

  if (!RiveComponent) return <GradientFallback avatarState={avatarState} size={size} />;

  return (
    <RiveComponent
      ref={riveRef}
      resourceName="avatar"
      stateMachineName="AvatarSM"
      style={{ width: size, height: size }}
    />
  );
}

// ─── Public component ──────────────────────────────────────────────────────

export default function RiveAvatar({ avatarState, size = 220 }: RiveAvatarProps) {
  // If Rive package is installed, use it; otherwise show gradient fallback
  if (RiveComponent) {
    return <RiveWrapper avatarState={avatarState} size={size} />;
  }
  return <GradientFallback avatarState={avatarState} size={size} />;
}

export { STATE_CONFIG };

const styles = StyleSheet.create({
  fallbackCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  fallbackEmoji: {
    textAlign: 'center',
  },
});
