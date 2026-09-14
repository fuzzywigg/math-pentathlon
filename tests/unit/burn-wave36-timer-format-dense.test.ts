/**
 * Wave 36 — formatTime / parseTime dense leftover matrix.
 * Beyond wave 31 format-parse samples. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { formatTime, parseTime } from '../../src/core/timer-scoring';

describe('Wave 36 timer — large duration formatting', () => {
  it('formats multi-hour durations as MM:SS with minutes > 59', () => {
    // formatTime uses total minutes, not HH:MM:SS emission
    expect(formatTime(3_600_000)).toBe('60:00');
    expect(formatTime(3_661_000)).toBe('61:01');
    expect(formatTime(36_000_000)).toBe('600:00');
  });

  it('showMilliseconds on large durations', () => {
    expect(formatTime(3_661_230, { showMilliseconds: true })).toBe('61:01.23');
    expect(formatTime(999, { showMilliseconds: true })).toBe('00:00.99');
  });

  it('unpadded multi-digit minutes keep full digit width', () => {
    expect(formatTime(600_000, { padMinutes: false })).toBe('10:00');
    expect(formatTime(3_600_000, { padMinutes: false })).toBe('60:00');
  });
});

describe('Wave 36 timer — parseTime leftover edges', () => {
  it('parses hour-heavy HH:MM:SS', () => {
    expect(parseTime('10:00:00')).toBe(10 * 3_600_000);
    expect(parseTime('99:59:59')).toBe((99 * 3600 + 59 * 60 + 59) * 1000);
  });

  it('single-digit MM:SS fragments parse via parseInt', () => {
    expect(parseTime('1:2')).toBe((1 * 60 + 2) * 1000);
    expect(parseTime('9:05')).toBe((9 * 60 + 5) * 1000);
  });

  it('centisecond padEnd handles single digit and empty', () => {
    expect(parseTime('00:00.5')).toBe(500);
    expect(parseTime('00:00.05')).toBe(50);
    expect(parseTime('00:00.00')).toBe(0);
  });
});

describe('Wave 36 timer — format → parse consistency table', () => {
  const table = [
    0, 10, 90, 990, 1_000, 1_010, 59_990, 60_000, 61_110, 600_000, 3_600_000,
    3_661_990,
  ];

  it.each(table)('centisecond round-trip for %i ms', (ms) => {
    const formatted = formatTime(ms, { showMilliseconds: true });
    expect(parseTime(formatted)).toBe(ms - (ms % 10));
  });

  it('custom separator round-trips when re-parsed with colon format only', () => {
    // parseTime always splits on ':'; custom separators are format-only
    expect(formatTime(90_000, { separator: '-' })).toBe('01-30');
    expect(parseTime('01:30')).toBe(90_000);
  });
});
