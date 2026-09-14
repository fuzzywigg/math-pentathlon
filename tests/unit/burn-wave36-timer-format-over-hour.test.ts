/**
 * Wave 36 — formatTime minutes overflow past 59 (no HH field).
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { formatTime, parseTime } from '../../src/core/timer-scoring';

describe('Wave 36 timer-format-hour — MM overflow', () => {
  it('formats 1h as 60:00 not 01:00:00', () => {
    expect(formatTime(3_600_000)).toBe('60:00');
    expect(formatTime(3_661_000)).toBe('61:01');
  });

  it('showMilliseconds keeps overflow minutes', () => {
    expect(formatTime(3_600_250, { showMilliseconds: true })).toBe('60:00.25');
  });

  it('parseTime HH:MM:SS still accepts hour form', () => {
    expect(parseTime('01:00:00')).toBe(3_600_000);
    expect(formatTime(parseTime('01:01:01'))).toBe('61:01');
  });
});
