/**
 * Audio Synthesizer & Audio File Analyzer
 * Uses Web Audio API for real audio decoding, real waveform extraction,
 * and client-side synthesized speech / tonal preview generation.
 */

export interface DecodedAudioInfo {
  durationSeconds: number;
  sampleRate: number;
  numberOfChannels: number;
  waveformPeaks: number[];
}

let sharedAudioCtx: AudioContext | null = null;

export function getAudioContext(): AudioContext {
  if (!sharedAudioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    sharedAudioCtx = new AudioContextClass();
  }
  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume().catch(() => {});
  }
  return sharedAudioCtx;
}

/**
 * Extracts waveform peaks and technical audio metadata from an uploaded file Blob/File
 */
export async function analyzeAudioFile(file: Blob): Promise<DecodedAudioInfo> {
  const audioCtx = getAudioContext();
  const arrayBuffer = await file.arrayBuffer();
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

  const durationSeconds = audioBuffer.duration;
  const sampleRate = audioBuffer.sampleRate;
  const numberOfChannels = audioBuffer.numberOfChannels;

  // Extract ~100 peaks for visual waveform
  const channelData = audioBuffer.getChannelData(0);
  const step = Math.floor(channelData.length / 100);
  const waveformPeaks: number[] = [];

  for (let i = 0; i < 100; i++) {
    const start = i * step;
    let max = 0;
    for (let j = 0; j < step; j += 10) {
      const val = Math.abs(channelData[start + j] || 0);
      if (val > max) max = val;
    }
    waveformPeaks.push(Math.min(1, Math.max(0.05, max)));
  }

  return {
    durationSeconds,
    sampleRate,
    numberOfChannels,
    waveformPeaks,
  };
}

/**
 * Generates an AudioBuffer with realistic speech cadenced tones for offline demo playback
 * when no microphone or external voice file is provided.
 */
export function generateDemoSpeechAudioBuffer(durationSeconds = 90): AudioBuffer {
  const audioCtx = getAudioContext();
  const sampleRate = audioCtx.sampleRate;
  const frameCount = Math.floor(sampleRate * durationSeconds);
  const buffer = audioCtx.createBuffer(2, frameCount, sampleRate);

  const left = buffer.getChannelData(0);
  const right = buffer.getChannelData(1);

  // Generate subtle documentary background drone + gentle narration acoustic pulses
  for (let i = 0; i < frameCount; i++) {
    const t = i / sampleRate;
    // Ambient warm pad chord (D minor drone: 146.8Hz, 220Hz, 329.6Hz)
    const pad =
      Math.sin(2 * Math.PI * 146.83 * t) * 0.04 +
      Math.sin(2 * Math.PI * 220.0 * t) * 0.03 +
      Math.sin(2 * Math.PI * 329.63 * t) * 0.02;

    // Speech rhythm simulation (bursts matching narration sentences)
    const isSpeaking = (t % 7.5) < 5.5; // speaks 5.5s, pauses 2s
    let speechTone = 0;
    if (isSpeaking) {
      // Voice formant fundamental ~130Hz modulated with speech envelope
      const env = Math.sin((t % 7.5) * Math.PI / 5.5);
      const voice =
        Math.sin(2 * Math.PI * 130 * t) * 0.08 +
        Math.sin(2 * Math.PI * 260 * t) * 0.04 +
        Math.sin(2 * Math.PI * 520 * t) * 0.02;
      speechTone = voice * env;
    }

    const sample = pad + speechTone;
    left[i] = sample;
    right[i] = sample;
  }

  return buffer;
}
