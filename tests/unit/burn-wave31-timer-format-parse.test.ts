/**
 * Wave 31 — formatTime / parseTime round-trip + option matrices.
 * Beyond wave 27 option smoke. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import { formatTime, parseTime } from '../../src/core/timer-scoring';

describe('Wave 31 timer — formatTime option matrix', () => {
  const samples = [0, 500, 1_000, 5_250, 65_000, 3_661_000, 3_599_990];

  it('default padding yields MM:SS for sample set', () => {
    for (const ms of samples) {
      const formatted = formatTime(ms);
      expect(formatted).toMatch(/^\d{2}:\d{2}$/);
    }
  });

  it('showMilliseconds appends two centisecond digits', () => {
    expect(formatTime(1_234, { showMilliseconds: true })).toBe('00:01.23');
    expect(formatTime(1_239, { showMilliseconds: true })).toBe('00:01.23');
    expect(formatTime(1_299, { showMilliseconds: true })).toBe('00:01.29');
  });

  it('padMinutes / padSeconds combinations', () => {
    const ms = 65_000; // 1:05
    expect(formatTime(ms, { padMinutes: true, padSeconds: true })).toBe(
      '01:05'
    );
    expect(formatTime(ms, { padMinutes: false, padSeconds: true })).toBe(
      '1:05'
    );
    expect(formatTime(ms, { padMinutes: true, padSeconds: false })).toBe(
      '01:5'
    );
    expect(formatTime(ms, { padMinutes: false, padSeconds: false })).toBe(
      '1:5'
    );
  });

  it('custom separators appear between minutes and seconds', () => {
    expect(formatTime(90_000, { separator: '.' })).toBe('01.30');
    expect(formatTime(90_000, { separator: 'm' })).toBe('01m30');
    expect(formatTime(90_500, { separator: ':', showMilliseconds: true })).toBe(
      '01:30.50'
    );
  });
});

describe('Wave 31 timer — parseTime shapes', () => {
  it('parses HH:MM:SS wall times', () => {
    expect(parseTime('00:00:00')).toBe(0);
    expect(parseTime('00:01:00')).toBe(60_000);
    expect(parseTime('01:00:00')).toBe(3_600_000);
    expect(parseTime('02:30:15')).toBe((2 * 3600 + 30 * 60 + 15) * 1000);
  });

  it('parses MM:SS and MM:SS.cs', () => {
    expect(parseTime('00:00')).toBe(0);
    expect(parseTime('10:00')).toBe(600_000);
    expect(parseTime('00:00.01')).toBe(10);
    expect(parseTime('00:00.1')).toBe(100); // padEnd('1') → '10' → 100ms
    expect(parseTime('00:00.99')).toBe(990);
    expect(parseTime('03:45.25')).toBe(3 * 60_000 + 45_000 + 250);
  });

  it('truncates centisecond fragment to two digits', () => {
    expect(parseTime('00:01.999')).toBe(1_000 + 990);
    expect(parseTime('00:01.001')).toBe(1_000 + 0);
  });
});

describe('Wave 31 timer — format/parse round-trips', () => {
  const roundTripMs = [
    0, 10, 50, 990, 1_000, 5_250, 60_000, 65_500, 600_000, 3_661_000,
  ];

  it.each(roundTripMs)('round-trips %i ms via MM:SS.cs', (ms) => {
    const formatted = formatTime(ms, { showMilliseconds: true });
    expect(parseTime(formatted)).toBe(ms - (ms % 10)); // centisecond resolution
  });

  it('round-trips whole seconds without milliseconds', () => {
    for (const sec of [0, 1, 59, 60, 125, 3600]) {
      const ms = sec * 1000;
      const formatted = formatTime(ms);
      expect(parseTime(formatted)).toBe(ms);
    }
  });
});
