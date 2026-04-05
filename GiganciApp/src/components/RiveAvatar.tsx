/**
 * RiveAvatar — Avatar komponent.
 *
 * Używa BrainBearAvatar (pluszowy miś z mózgiem) jako domyślnego avatara.
 * Jeśli zainstalowany jest @rive-app/react-native i dostępny plik assets/avatar.riv,
 * zostanie użyty Rive zamiast BrainBear.
 *
 * ═══════════════════════════════════════════════════════════════════
 * JAK DODAĆ PLIK RIVE (opcjonalne — zastąpi BrainBear):
 *
 * 1. Wejdź na rive.app/community i pobierz postać (character, mascot).
 *
 * 2. W edytorze Rive stwórz State Machine "AvatarSM" z:
 *    - 4 stanami: idle, talking, listening, thinking
 *    - 3 wejściami Boolean:
 *        • isTalking   → stan "talking"
 *        • isListening → stan "listening"
 *        • isThinking  → stan "thinking"
 *    - Gdy wszystkie false → stan "idle"
 *
 * 3. Eksportuj jako: GiganciApp/assets/avatar.riv
 * ═══════════════════════════════════════════════════════════════════
 */

import React, { useEffect, useRef } from 'react';
import BrainBearAvatar from './BrainBearAvatar';
import { AvatarState } from '../services/realtimeService';

// Próba załadowania Rive — jeśli pakiet lub plik .riv niedostępny, używamy BrainBear
let RiveComponent: React.ComponentType<{
  resourceName: string;
  stateMachineName: string;
  style?: object;
}> | null = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const riveModule = require('@rive-app/react-native');
  RiveComponent = riveModule.Rive;
} catch {
  // Pakiet nie zainstalowany — BrainBearAvatar aktywny
}

// ─── Typy ──────────────────────────────────────────────────────────────────

interface RiveAvatarProps {
  avatarState: AvatarState;
  size?: number;
}

// ─── Konfiguracja stanów (etykiety, kolory dla StatusBadge) ────────────────

export const STATE_CONFIG: Record<AvatarState, { emoji: string; color: string; label: string }> = {
  idle:      { emoji: '🧸', color: '#6C3CE1', label: 'Gotowy' },
  listening: { emoji: '👂', color: '#10B981', label: 'Słucham...' },
  thinking:  { emoji: '🤔', color: '#F59E0B', label: 'Myślę...' },
  talking:   { emoji: '💬', color: '#3B82F6', label: 'Mówię...' },
};

// ─── Rive wrapper (gdy plik .riv dostępny) ─────────────────────────────────

function RiveWrapper({ avatarState, size = 220 }: RiveAvatarProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const riveRef = useRef<any>(null);

  useEffect(() => {
    if (!riveRef.current) return;
    try {
      riveRef.current.setBooleanStateAtPath('isTalking',   avatarState === 'talking',   'AvatarSM');
      riveRef.current.setBooleanStateAtPath('isListening', avatarState === 'listening', 'AvatarSM');
      riveRef.current.setBooleanStateAtPath('isThinking',  avatarState === 'thinking',  'AvatarSM');
    } catch {
      // State machine jeszcze nie gotowa — ignoruj
    }
  }, [avatarState]);

  if (!RiveComponent) {
    return <BrainBearAvatar avatarState={avatarState} size={size} />;
  }

  return (
    <RiveComponent
      ref={riveRef}
      resourceName="avatar"
      stateMachineName="AvatarSM"
      style={{ width: size, height: size }}
    />
  );
}

// ─── Publiczny komponent ───────────────────────────────────────────────────

export default function RiveAvatar({ avatarState, size = 220 }: RiveAvatarProps) {
  // Jeśli Rive zainstalowany → użyj Rive; w przeciwnym razie → BrainBearAvatar
  if (RiveComponent) {
    return <RiveWrapper avatarState={avatarState} size={size} />;
  }
  return <BrainBearAvatar avatarState={avatarState} size={size} />;
}
