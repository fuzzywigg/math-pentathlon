/**
 * Wave 40 — stats formatWinRate NaN/Infinity leftovers.
 * Tests-only after #178.
 */
import { describe, it, expect } from 'vitest';

import {
  formatWinRate,
  formatPlayTime,
} from '../../src/ui/stats-dashboard';

describe('Wave 40 stats — winrate nan / playtime', () => {
  it('formatWinRate non-finite and non-positive → 0%', () => {
    expect(formatWinRate(NaN)).toBe('0%');
    expect(formatWinRate(Infinity)).toBe('0%');
    expect(formatWinRate(-Infinity)).toBe('0%');
    expect(formatWinRate(0)).toBe('0%');
    expect(formatWinRate(-0.5)).toBe('0%');
  });

  it('formatWinRate positive finite rounds percent', () => {
    expect(formatWinRate(0.5)).toBe('50%');
    expect(formatWinRate(1)).toBe('100%');
  });

  it('formatPlayTime handles zero', () => {
    expect(formatPlayTime(0)).toMatch(/0/);
  });
});
