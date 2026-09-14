/**
 * Wave 42 — formatPlayTime / formatWinRate matrix leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  formatPlayTime,
  formatWinRate,
  formatLastPlayed,
} from '../../src/ui/stats-dashboard';

describe('Wave 42 stats — playtime winrate format', () => {
  it('formatPlayTime sub-minute floors to 0 min', () => {
    expect(formatPlayTime(0)).toBe('0 min');
    expect(formatPlayTime(59_999)).toBe('0 min');
    expect(formatPlayTime(60_000)).toBe('1 min');
  });

  it('formatPlayTime hour boundaries', () => {
    expect(formatPlayTime(60 * 60_000)).toBe('1h');
    expect(formatPlayTime(90 * 60_000)).toBe('1h 30m');
    expect(formatPlayTime(150 * 60_000)).toBe('2h 30m');
  });

  it('formatWinRate clamps non-positive and non-finite', () => {
    expect(formatWinRate(0)).toBe('0%');
    expect(formatWinRate(-1)).toBe('0%');
    expect(formatWinRate(NaN)).toBe('0%');
    expect(formatWinRate(Infinity)).toBe('0%');
  });

  it('formatWinRate rounds mid values', () => {
    expect(formatWinRate(0.333)).toBe('33%');
    expect(formatWinRate(0.666)).toBe('67%');
    expect(formatWinRate(1)).toBe('100%');
  });

  it('formatLastPlayed dash for falsy timestamps', () => {
    expect(formatLastPlayed(0)).toBe('—');
    expect(formatLastPlayed(Date.UTC(2025, 5, 1))).not.toBe('—');
  });
});
