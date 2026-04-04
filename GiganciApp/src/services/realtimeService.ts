import { Lesson } from '../data/pythonCurriculum';

export const REALTIME_URL =
  'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview';

// ─── Session config ────────────────────────────────────────────────────────

export function buildSessionConfig(lesson: Lesson) {
  const instructions = [
    'Jesteś Piko — przyjaznym avatarem-korepetytorem dla dzieci w wieku 8–12 lat uczących się programowania w Pythonie.',
    'Mów wyłącznie po polsku.',
    `Przeprowadzasz powtórkę lekcji: "${lesson.title}".`,
    `Kluczowe tematy tej lekcji: ${lesson.systemPromptContext}.`,
    'Zasady prowadzenia rozmowy:',
    '- Zadaj jedno pytanie na raz i poczekaj na odpowiedź dziecka.',
    '- Chwal za poprawne odpowiedzi entuzjastycznie ("Super!", "Brawo!", "Dokładnie tak!").',
    '- Gdy dziecko odpowiada błędnie lub mówi że nie wie, daj wskazówkę i zapytaj ponownie.',
    '- Używaj prostego, przyjaznego języka — bez żargonu technicznego.',
    '- Opisuj pojęcia słowami, nie pokazuj kodu — rozmawiasz głosowo.',
    '- Po 4–5 pytaniach podsumuj sesję i pochwal dziecko za udział.',
    'Zacznij od krótkiego, ciepłego powitania i zadaj pierwsze pytanie o tej lekcji.',
  ].join('\n');

  return {
    type: 'session.update',
    session: {
      modalities: ['audio', 'text'],
      instructions,
      voice: 'nova',
      input_audio_format: 'pcm16',
      output_audio_format: 'pcm16',
      input_audio_transcription: { model: 'whisper-1' },
      turn_detection: {
        type: 'server_vad',
        threshold: 0.5,
        prefix_padding_ms: 300,
        silence_duration_ms: 700,
      },
      temperature: 0.8,
    },
  };
}

// ─── Audio helpers ─────────────────────────────────────────────────────────

/** Encode raw PCM ArrayBuffer to base64 string */
export function encodeAudioChunk(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/** Decode base64 PCM string to Int16Array for playback */
export function decodeAudioDelta(base64: string): Int16Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Int16Array(bytes.buffer);
}

// ─── WebSocket event types ─────────────────────────────────────────────────

export type AvatarState = 'idle' | 'listening' | 'thinking' | 'talking';

export interface RealtimeEvent {
  type: string;
  [key: string]: unknown;
}

export interface AudioDeltaEvent extends RealtimeEvent {
  type: 'response.audio.delta';
  delta: string; // base64 PCM16
}

export interface TranscriptDeltaEvent extends RealtimeEvent {
  type: 'response.audio_transcript.delta';
  delta: string;
}

/** Maps incoming WebSocket event types to avatar state changes */
export function eventToAvatarState(eventType: string): AvatarState | null {
  switch (eventType) {
    case 'input_audio_buffer.speech_started':
      return 'listening';
    case 'input_audio_buffer.speech_stopped':
    case 'input_audio_buffer.committed':
      return 'thinking';
    case 'response.audio.delta':
      return 'talking';
    case 'response.done':
    case 'response.audio.done':
      return 'idle';
    default:
      return null;
  }
}
