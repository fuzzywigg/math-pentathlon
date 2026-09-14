/**
 * Wave 44 overnight HEAVY — stats formatPlayTime ladder leftovers.
 */
import { describe, it, expect } from 'vitest';
import { formatPlayTime, formatWinRate, formatLastPlayed } from '../../src/ui/stats-dashboard';

describe('Wave 44 UI — stats format ladder', () => {
  it('play time minutes / hours / mixed', () => {
    expect(formatPlayTime(-5)).toBe('0 min');
    expect(formatPlayTime(59_999)).toBe('0 min');
    expect(formatPlayTime(60_000)).toBe('1 min');
    expect(formatPlayTime(59 * 60_000)).toBe('59 min');
    expect(formatPlayTime(60 * 60_000)).toBe('1h');
    expect(formatPlayTime(61 * 60_000)).toBe('1h 1m');
    expect(formatPlayTime(150 * 60_000)).toBe('2h 30m');
  });

  it('win rate and last played edges', () => {
    expect(formatWinRate(-1)).toBe('0%');
    expect(formatWinRate(Infinity)).toBe('0%');
    expect(formatWinRate(0.994)).toBe('99%');
    expect(formatLastPlayed(0)).toBe('—');
    expect(formatLastPlayed(Number.NaN)).toBe('—');
  });
});
