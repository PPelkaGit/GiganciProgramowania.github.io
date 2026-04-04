import { useCallback, useEffect, useRef, useState } from 'react';
import { Audio } from 'expo-av';
import {
  REALTIME_URL,
  AvatarState,
  AudioDeltaEvent,
  TranscriptDeltaEvent,
  buildSessionConfig,
  encodeAudioChunk,
  eventToAvatarState,
} from '../services/realtimeService';
import { getLesson } from '../data/pythonCurriculum';

const OPENAI_API_KEY_PLACEHOLDER = 'YOUR_OPENAI_API_KEY';

// ─── Types ─────────────────────────────────────────────────────────────────

export interface TranscriptEntry {
  role: 'piko' | 'student';
  text: string;
}

export interface UseRealtimeAvatarChat {
  avatarState: AvatarState;
  isConnected: boolean;
  transcript: TranscriptEntry[];
  connect: (lessonId: string) => void;
  disconnect: () => void;
  error: string | null;
}

// ─── Audio recording config (PCM16, 24kHz, mono) ──────────────────────────

const RECORDING_OPTIONS: Audio.RecordingOptions = {
  android: {
    extension: '.wav',
    outputFormat: Audio.AndroidOutputFormat.DEFAULT,
    audioEncoder: Audio.AndroidAudioEncoder.DEFAULT,
    sampleRate: 24000,
    numberOfChannels: 1,
    bitRate: 128000,
  },
  ios: {
    extension: '.wav',
    outputFormat: Audio.IOSOutputFormat.LINEARPCM,
    audioQuality: Audio.IOSAudioQuality.HIGH,
    sampleRate: 24000,
    numberOfChannels: 1,
    bitRate: 384000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
  web: {},
};

// ─── Hook ──────────────────────────────────────────────────────────────────

export function useRealtimeAvatarChat(): UseRealtimeAvatarChat {
  const [avatarState, setAvatarState] = useState<AvatarState>('idle');
  const [isConnected, setIsConnected] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const recordingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastFileSizeRef = useRef(0);
  const audioDeltaBufferRef = useRef<string[]>([]);
  const soundRef = useRef<Audio.Sound | null>(null);
  const isPlayingRef = useRef(false);
  const pikoTranscriptBufferRef = useRef('');

  // ── Cleanup ───────────────────────────────────────────────────────────

  const stopRecording = useCallback(async () => {
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
    if (recordingRef.current) {
      try {
        await recordingRef.current.stopAndUnloadAsync();
      } catch {
        // already stopped
      }
      recordingRef.current = null;
    }
    lastFileSizeRef.current = 0;
  }, []);

  const stopAudioPlayback = useCallback(async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
      } catch {
        // ignore
      }
      soundRef.current = null;
    }
    isPlayingRef.current = false;
    audioDeltaBufferRef.current = [];
  }, []);

  const disconnect = useCallback(async () => {
    await stopRecording();
    await stopAudioPlayback();
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
    setAvatarState('idle');
  }, [stopRecording, stopAudioPlayback]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  // ── Play queued audio deltas ──────────────────────────────────────────

  const flushAudioBuffer = useCallback(async () => {
    if (isPlayingRef.current || audioDeltaBufferRef.current.length === 0) return;
    isPlayingRef.current = true;

    const chunk = audioDeltaBufferRef.current.shift()!;
    try {
      // Decode base64 PCM16 → WAV data URI for expo-av
      const wavDataUri = `data:audio/wav;base64,${chunk}`;
      const { sound } = await Audio.Sound.createAsync(
        { uri: wavDataUri },
        { shouldPlay: true }
      );
      soundRef.current = sound;
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          isPlayingRef.current = false;
          sound.unloadAsync();
          flushAudioBuffer();
        }
      });
    } catch {
      isPlayingRef.current = false;
      flushAudioBuffer();
    }
  }, []);

  // ── Start microphone streaming ────────────────────────────────────────

  const startMicrophoneStreaming = useCallback(async () => {
    const { granted } = await Audio.requestPermissionsAsync();
    if (!granted) {
      setError('Brak dostępu do mikrofonu. Sprawdź uprawnienia aplikacji.');
      return;
    }

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync(RECORDING_OPTIONS);
    await recording.startAsync();
    recordingRef.current = recording;

    // Every 200ms: read the recording file and send new bytes to Realtime API
    recordingIntervalRef.current = setInterval(async () => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
      if (!recordingRef.current) return;

      try {
        const uri = recordingRef.current.getURI();
        if (!uri) return;

        // Read file as base64 and extract only new bytes since last read
        const { FileSystem } = await import('expo-file-system');
        const info = await FileSystem.getInfoAsync(uri, { size: true });
        const currentSize = (info as { size?: number }).size ?? 0;

        if (currentSize <= lastFileSizeRef.current) return;

        const base64Full = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Send only the new portion (approximate: new bytes as fraction of full base64)
        const prevBase64Len = Math.floor((lastFileSizeRef.current / currentSize) * base64Full.length);
        const newChunkBase64 = base64Full.slice(prevBase64Len);
        lastFileSizeRef.current = currentSize;

        if (newChunkBase64.length > 0) {
          wsRef.current.send(
            JSON.stringify({ type: 'input_audio_buffer.append', audio: newChunkBase64 })
          );
        }
      } catch {
        // Ignore transient file read errors
      }
    }, 200);
  }, []);

  // ── WebSocket message handler ─────────────────────────────────────────

  const handleWsMessage = useCallback(
    (raw: string) => {
      let event: { type: string; [key: string]: unknown };
      try {
        event = JSON.parse(raw);
      } catch {
        return;
      }

      // Update avatar state from event type
      const newAvatarState = eventToAvatarState(event.type);
      if (newAvatarState) {
        setAvatarState(newAvatarState);
      }

      switch (event.type) {
        case 'response.audio.delta': {
          const delta = (event as AudioDeltaEvent).delta;
          if (delta) {
            audioDeltaBufferRef.current.push(delta);
            flushAudioBuffer();
          }
          break;
        }

        case 'response.audio_transcript.delta': {
          const delta = (event as TranscriptDeltaEvent).delta;
          if (delta) {
            pikoTranscriptBufferRef.current += delta;
          }
          break;
        }

        case 'response.audio_transcript.done': {
          const finalText = pikoTranscriptBufferRef.current.trim();
          if (finalText) {
            setTranscript((prev) => [...prev, { role: 'piko', text: finalText }]);
          }
          pikoTranscriptBufferRef.current = '';
          break;
        }

        case 'conversation.item.input_audio_transcription.completed': {
          const transcriptText = (event.transcript as string | undefined)?.trim();
          if (transcriptText) {
            setTranscript((prev) => [...prev, { role: 'student', text: transcriptText }]);
          }
          break;
        }

        case 'error': {
          const errMsg = (event.error as { message?: string } | undefined)?.message ?? 'Nieznany błąd';
          setError(`Błąd Realtime API: ${errMsg}`);
          disconnect();
          break;
        }
      }
    },
    [flushAudioBuffer, disconnect]
  );

  // ── Connect ───────────────────────────────────────────────────────────

  const connect = useCallback(
    (lessonId: string) => {
      if (wsRef.current) return; // already connected

      const lesson = getLesson(lessonId);
      if (!lesson) {
        setError(`Nie znaleziono lekcji: ${lessonId}`);
        return;
      }

      // Resolve API key
      const apiKey: string =
        (typeof process !== 'undefined' && process.env?.OPENAI_API_KEY) ||
        OPENAI_API_KEY_PLACEHOLDER;

      if (!apiKey || apiKey === OPENAI_API_KEY_PLACEHOLDER) {
        setError(
          'Brak klucza OPENAI_API_KEY. Dodaj go do zmiennych środowiskowych aplikacji.'
        );
        return;
      }

      setError(null);
      setTranscript([]);
      pikoTranscriptBufferRef.current = '';

      const ws = new WebSocket(REALTIME_URL, [], {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'OpenAI-Beta': 'realtime=v1',
        },
      } as WebSocket);

      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setAvatarState('idle');
        // Configure session
        ws.send(JSON.stringify(buildSessionConfig(lesson)));
        // Start microphone
        startMicrophoneStreaming();
      };

      ws.onmessage = (e) => {
        handleWsMessage(typeof e.data === 'string' ? e.data : '');
      };

      ws.onerror = () => {
        setError('Błąd połączenia z OpenAI Realtime API. Sprawdź klucz API i połączenie internetowe.');
        disconnect();
      };

      ws.onclose = () => {
        setIsConnected(false);
        setAvatarState('idle');
        wsRef.current = null;
        stopRecording();
      };
    },
    [handleWsMessage, startMicrophoneStreaming, stopRecording, disconnect]
  );

  return { avatarState, isConnected, transcript, connect, disconnect, error };
}
