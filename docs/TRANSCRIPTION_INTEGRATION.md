# Audio & Transcription Integration Interface

## Core Principle: Audio-First Editing
The user's uploaded narration is the authoritative clock of the project. Spoken timing is never synthesized or altered behind the user's back.

## Interface Contract
```typescript
interface TranscriptionWorkerInput {
  audioFileUrl: string;
  language: string; // default "en-US"
  model: 'tiny.en' | 'base.en' | 'small.en' | 'medium.en';
  alignmentMode: 'word_timestamps' | 'segment_fallback';
  vocabularyHints?: string[];
}

interface TranscriptionWorkerOutput {
  engine: string;
  durationMs: number;
  averageConfidence: number;
  segments: {
    id: string;
    startMs: number;
    endMs: number;
    text: string;
    speakerId: string;
    confidence: number;
    words: {
      word: string;
      startMs: number;
      endMs: number;
      confidence: number;
    }[];
  }[];
  diagnostics: {
    clippingDetected: boolean;
    speechRateWpm: number;
    longPausesDetected: number;
  };
}
```

## Local Web Audio Fallback
When running client-side or offline, Framecraft uses HTML5 Web Audio API:
- `AudioContext.decodeAudioData` analyzes binary headers, sample rate (e.g. 48,000 Hz), channels (stereo/mono), and computes exact amplitude peaks for the waveform display.
- Demo synthetic tones follow realistic speech cadences without replacing user audio.
