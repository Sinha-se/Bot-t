import { describe, it, expect } from 'vitest';
import { formatTimecodeSRT, formatTimecodeVTT } from '../services/exportPackager';

describe('Timeline & Timecode Conversion', () => {
  it('correctly converts milliseconds to SRT timecode format (HH:MM:SS,mmm)', () => {
    expect(formatTimecodeSRT(0)).toBe('00:00:00,000');
    expect(formatTimecodeSRT(5800)).toBe('00:00:05,800');
    expect(formatTimecodeSRT(65432)).toBe('00:01:05,432');
    expect(formatTimecodeSRT(3661050)).toBe('01:01:01,050');
  });

  it('correctly converts milliseconds to WebVTT timecode format (HH:MM:SS.mmm)', () => {
    expect(formatTimecodeVTT(0)).toBe('00:00:00.000');
    expect(formatTimecodeVTT(5800)).toBe('00:00:05.800');
    expect(formatTimecodeVTT(65432)).toBe('00:01:05.432');
  });

  it('computes frame numbers accurately at 30 fps without drift', () => {
    const fps = 30;
    const durationSeconds = 89.8;
    const totalFrames = Math.round(durationSeconds * fps);
    expect(totalFrames).toBe(2694);

    const frameToSec = (frame: number) => frame / fps;
    expect(frameToSec(30)).toBe(1.0);
    expect(frameToSec(180)).toBe(6.0);
  });
});
