import { describe, it, expect } from 'vitest';
import { generateSRT, generateVTT, generatePlainTranscript } from '../services/exportPackager';
import { DEMO_TRANSCRIPT_SEGMENTS, DEMO_PROJECT } from '../data/seedData';

describe('Captions & Subtitle Generation', () => {
  it('generates valid SRT format with sequential numbering and timecode arrows', () => {
    const srt = generateSRT(DEMO_TRANSCRIPT_SEGMENTS.slice(0, 2));
    expect(srt).toContain('1\n00:00:00,000 --> 00:00:05,800\nBefore sunrise, the city is already preparing to move.');
    expect(srt).toContain('2\n00:00:06,000 --> 00:00:11,800\nA railway platform fills slowly.');
  });

  it('generates valid WebVTT with WEBVTT header', () => {
    const vtt = generateVTT(DEMO_TRANSCRIPT_SEGMENTS.slice(0, 1));
    expect(vtt.startsWith('WEBVTT')).toBe(true);
    expect(vtt).toContain('00:00:00.000 --> 00:00:05.800');
  });

  it('generates plain transcript document with speaker tags', () => {
    const txt = generatePlainTranscript(DEMO_TRANSCRIPT_SEGMENTS.slice(0, 2), DEMO_PROJECT);
    expect(txt).toContain('FRAMECRAFT PRODUCTION TRANSCRIPT');
    expect(txt).toContain('Narrator (English): Before sunrise');
  });
});
