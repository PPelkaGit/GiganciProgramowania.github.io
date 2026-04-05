/**
 * BrainBearAvatar — Pluszowy miś z mózgiem na głowie 🧸🧠
 *
 * Rysowany w SVG, animowany przez React Native Animated API.
 * Stany: idle (oddychanie), talking (usta), listening (oczy), thinking (dymek)
 */

import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import Svg, { Circle, Ellipse, Path, G } from 'react-native-svg';
import { AvatarState } from '../services/realtimeService';

// ─── Kolory ────────────────────────────────────────────────────────────────

const C = {
  bearBase:    '#F7D6AA',  // ciepły beż — ciało misia
  bearMid:     '#EEC080',  // nieco ciemniejszy — cienie
  bearDark:    '#D4956A',  // ciemniejszy — wewnętrzne uszy, łapy
  brainPink:   '#FFB3CE',  // jasny różowy — mózg
  brainFold:   '#FF6FA3',  // ciemniejszy różowy — fałdy mózgu
  brainPurple: '#C8A4E8',  // fioletowy — akcenty mózgu
  eyeWhite:    '#FFFFFF',
  eyeDark:     '#1A1A2E',
  nose:        '#7D4E44',
  mouth:       '#7D4E44',
  mouthIn:     '#B54040',
  tongue:      '#E8786E',
  blush:       '#FF9090',
  thinkDot:    '#6C3CE1',
};

// ─── Animowane krople dla stanu "thinking" ─────────────────────────────────

function ThinkDots({ visible }: { visible: boolean }) {
  const a0 = useRef(new Animated.Value(0)).current;
  const a1 = useRef(new Animated.Value(0)).current;
  const a2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anims = [a0, a1, a2];
    if (!visible) {
      anims.forEach(a => { a.stopAnimation(); a.setValue(0); });
      return;
    }

    const loops = anims.map((a, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 180),
          Animated.timing(a, { toValue: -10, duration: 340, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.timing(a, { toValue: 0,   duration: 340, easing: Easing.in(Easing.quad),  useNativeDriver: true }),
          Animated.delay(540 - i * 180),
        ])
      )
    );
    loops.forEach(l => l.start());
    return () => loops.forEach(l => l.stop());
  }, [visible, a0, a1, a2]);

  if (!visible) return null;

  return (
    <View style={styles.thinkDotsRow}>
      {[a0, a1, a2].map((a, i) => (
        <Animated.View
          key={i}
          style={[styles.thinkDot, { transform: [{ translateY: a }], opacity: 1 - i * 0.2 }]}
        />
      ))}
    </View>
  );
}

// ─── Główny komponent ──────────────────────────────────────────────────────

interface Props {
  avatarState: AvatarState;
  size?: number;
}

export default function BrainBearAvatar({ avatarState, size = 220 }: Props) {
  const breatheAnim = useRef(new Animated.Value(0)).current;
  const [mouthOpen, setMouthOpen] = useState(false);
  const mouthTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Animacja oddychania (idle) lub podskakiwania (talking) ────────────

  useEffect(() => {
    breatheAnim.stopAnimation();

    if (avatarState === 'idle') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(breatheAnim, { toValue: 1, duration: 2400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(breatheAnim, { toValue: 0, duration: 2400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ])
      ).start();
    } else if (avatarState === 'talking') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(breatheAnim, { toValue: 0.8, duration: 260, useNativeDriver: true }),
          Animated.timing(breatheAnim, { toValue: 0,   duration: 260, useNativeDriver: true }),
        ])
      ).start();
    } else if (avatarState === 'listening') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(breatheAnim, { toValue: 0.5, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(breatheAnim, { toValue: 0,   duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ])
      ).start();
    }

    return () => breatheAnim.stopAnimation();
  }, [avatarState, breatheAnim]);

  // ── Animacja ust (talking) ────────────────────────────────────────────

  useEffect(() => {
    if (mouthTimerRef.current) {
      clearInterval(mouthTimerRef.current);
      mouthTimerRef.current = null;
    }
    if (avatarState === 'talking') {
      mouthTimerRef.current = setInterval(() => setMouthOpen(p => !p), 270);
    } else {
      setMouthOpen(false);
    }
    return () => {
      if (mouthTimerRef.current) clearInterval(mouthTimerRef.current);
    };
  }, [avatarState]);

  // ── Interpolacje ──────────────────────────────────────────────────────

  const scale = breatheAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, avatarState === 'idle' ? 1.028 : 1.018],
  });

  const translateY = breatheAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, avatarState === 'talking' ? -4 : 0],
  });

  // ── Stan ust i oczu ───────────────────────────────────────────────────

  const isListening = avatarState === 'listening';
  const isThinking  = avatarState === 'thinking';
  const eyeR = isListening ? 10.5 : 8.5;
  const pupilR = eyeR * 0.58;
  const shineR = isListening ? 3.5 : 2.5;

  // Usta zamknięte: delikatny uśmiech; otwarte: szeroki uśmiech z wnętrzem
  const mouthPath = mouthOpen
    ? 'M 91,132 Q 110,156 129,132'
    : 'M 92,132 Q 110,141 128,132';

  return (
    <Animated.View
      style={{
        width: size,
        height: size,
        alignItems: 'center',
        justifyContent: 'center',
        transform: [{ scale }, { translateY }],
      }}
    >
      {/* Dymek myślenia */}
      <ThinkDots visible={isThinking} />

      <Svg width={size} height={size} viewBox="0 0 220 220">

        {/* ════════════════════════════════════════
            CIAŁO
        ════════════════════════════════════════ */}
        <Ellipse cx="110" cy="188" rx="64" ry="46" fill={C.bearBase} />
        {/* Cień na brzuchu */}
        <Ellipse cx="110" cy="192" rx="38" ry="26" fill={C.bearMid} opacity="0.4" />
        {/* Pluszowe łatki na brzuchu */}
        <Ellipse cx="110" cy="180" rx="24" ry="18" fill={C.bearMid} opacity="0.22" />

        {/* ════════════════════════════════════════
            ŁAPY (ramiona)
        ════════════════════════════════════════ */}
        {/* Lewa łapa */}
        <Ellipse cx="51"  cy="176" rx="17" ry="26" fill={C.bearBase} transform="rotate(-18 51 176)" />
        <Ellipse cx="42"  cy="196" rx="12" ry="8"  fill={C.bearDark} />
        {/* Prawa łapa */}
        <Ellipse cx="169" cy="176" rx="17" ry="26" fill={C.bearBase} transform="rotate(18 169 176)" />
        <Ellipse cx="178" cy="196" rx="12" ry="8"  fill={C.bearDark} />

        {/* ════════════════════════════════════════
            USZY (za głową)
        ════════════════════════════════════════ */}
        {/* Lewe ucho */}
        <Circle cx="61"  cy="55" r="24" fill={C.bearBase} />
        <Circle cx="61"  cy="55" r="14" fill={C.bearDark}  opacity="0.8" />
        <Circle cx="61"  cy="49" r="9"  fill={C.brainPink} />

        {/* Prawe ucho */}
        <Circle cx="159" cy="55" r="24" fill={C.bearBase} />
        <Circle cx="159" cy="55" r="14" fill={C.bearDark}  opacity="0.8" />
        <Circle cx="159" cy="49" r="9"  fill={C.brainPink} />

        {/* ════════════════════════════════════════
            GŁOWA — base
        ════════════════════════════════════════ */}
        <Circle cx="110" cy="112" r="60" fill={C.bearBase} />

        {/* ════════════════════════════════════════
            MÓZG — różowa część na czubku głowy
            Bumpy blob pokrywający górne ~40% głowy
        ════════════════════════════════════════ */}
        {/* Główny blob mózgu */}
        <Path
          d={[
            'M 53,102',
            'Q 54,74  68,61',
            'Q 80,47  100,44',
            'Q 110,42 120,44',
            'Q 140,47 152,61',
            'Q 166,74 166,102',
            // Dolna krawędź — pagórkowata jak mózg
            'Q 152,90 140,87',
            'Q 128,80 118,88',
            'Q 110,84 102,88',
            'Q 92,80  80,87',
            'Q 68,90  53,102 Z',
          ].join(' ')}
          fill={C.brainPink}
        />

        {/* Fałd mózgowy — górna warstwa (ciemniejszy różowy) */}
        <Path
          d="M 90,60 Q 98,50 110,53 Q 122,50 130,60"
          fill="none"
          stroke={C.brainFold}
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        {/* Fałd środkowy szeroki */}
        <Path
          d="M 68,82 Q 78,67 92,74 Q 99,63 110,66 Q 121,63 128,74 Q 142,67 152,82"
          fill="none"
          stroke={C.brainFold}
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        {/* Fałd dolny (granica mózg/twarz) */}
        <Path
          d="M 60,96 Q 74,85 86,90 Q 96,80 110,84 Q 124,80 134,90 Q 146,85 160,96"
          fill="none"
          stroke={C.brainFold}
          strokeWidth="2.0"
          strokeLinecap="round"
        />
        {/* Małe zakręty po bokach */}
        <Path
          d="M 70,70 Q 76,64 84,69"
          fill="none"
          stroke={C.brainFold}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <Path
          d="M 136,69 Q 144,63 150,70"
          fill="none"
          stroke={C.brainFold}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        {/* Fioletowe akcenty mózgu */}
        <Path
          d="M 102,50 Q 110,46 118,50"
          fill="none"
          stroke={C.brainPurple}
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <Path
          d="M 82,72 Q 88,66 96,71"
          fill="none"
          stroke={C.brainPurple}
          strokeWidth="2.0"
          strokeLinecap="round"
        />
        <Path
          d="M 124,71 Q 132,65 138,72"
          fill="none"
          stroke={C.brainPurple}
          strokeWidth="2.0"
          strokeLinecap="round"
        />

        {/* ════════════════════════════════════════
            TWARZ
        ════════════════════════════════════════ */}

        {/* Różowe policzki */}
        <Ellipse cx="79"  cy="126" rx="15" ry="10" fill={C.blush} opacity="0.38" />
        <Ellipse cx="141" cy="126" rx="15" ry="10" fill={C.blush} opacity="0.38" />

        {/* Lewe oko */}
        <Circle cx="90"  cy="114" r={eyeR}  fill={C.eyeWhite} />
        <Circle cx="90"  cy="116" r={pupilR} fill={C.eyeDark} />
        <Circle cx="92"  cy="112" r={shineR} fill={C.eyeWhite} />

        {/* Prawe oko */}
        <Circle cx="130" cy="114" r={eyeR}  fill={C.eyeWhite} />
        <Circle cx="130" cy="116" r={pupilR} fill={C.eyeDark} />
        <Circle cx="132" cy="112" r={shineR} fill={C.eyeWhite} />

        {/* Uniesione brwi (słuchanie) */}
        {isListening && (
          <G>
            <Path
              d="M 82,103 Q 90,97 98,102"
              fill="none" stroke={C.bearDark} strokeWidth="2.2" strokeLinecap="round"
            />
            <Path
              d="M 122,102 Q 130,96 138,102"
              fill="none" stroke={C.bearDark} strokeWidth="2.2" strokeLinecap="round"
            />
          </G>
        )}

        {/* Nos */}
        <Ellipse cx="110" cy="128" rx="7" ry="5.5" fill={C.nose} />
        <Ellipse cx="108" cy="126" rx="2.5" ry="2"  fill={C.eyeWhite} opacity="0.4" />

        {/* Usta — otwarte lub zamknięte */}
        {mouthOpen ? (
          <G>
            {/* Zarys ust (otwarte) */}
            <Path d="M 91,132 Q 110,156 129,132" fill="none" stroke={C.mouth} strokeWidth="2.5" strokeLinecap="round" />
            {/* Wnętrze buzi */}
            <Path
              d="M 91,132 Q 110,156 129,132 Q 122,162 110,164 Q 98,162 91,132 Z"
              fill={C.mouthIn}
              opacity="0.85"
            />
            {/* Języczek */}
            <Ellipse cx="110" cy="150" rx="9" ry="6" fill={C.tongue} opacity="0.8" />
          </G>
        ) : (
          <Path
            d={mouthPath}
            fill="none"
            stroke={C.mouth}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        )}

        {/* Mała linia między nosem a ustami */}
        <Path
          d="M 110,134 L 110,132"
          stroke={C.nose}
          strokeWidth="1.5"
          strokeLinecap="round"
        />

      </Svg>
    </Animated.View>
  );
}

// ─── Style ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  thinkDotsRow: {
    position: 'absolute',
    top: 4,
    flexDirection: 'row',
    alignSelf: 'center',
    gap: 7,
    zIndex: 20,
  },
  thinkDot: {
    width: 11,
    height: 11,
    borderRadius: 5.5,
    backgroundColor: C.thinkDot,
  },
});
