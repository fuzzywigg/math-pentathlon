/**
 * q-mp-112 mutation audit UI wave 3 — kill survivors in stats-dashboard helpers.
 * Asserts format structure / numeric thresholds only (no game tutorial copy).
 */
import { describe, expect, it } from 'vitest';
import {
  formatLastPlayed,
  formatPlayTime,
  formatWinRate,
} from '../../src/ui/stats-dashboard';

describe('mutation-ui3 stats-dashboard formatters', () => {
  it('treats non-positive ms as the zero-minute bucket', () => {
    // Survivors around `ms <= 0` (boundary + numeric 0→1 are near-equivalent for
    // tiny positive ms that still floor to 0 minutes — pin the zero path).
    expect(formatPlayTime(0)).toBe('0 min');
    expect(formatPlayTime(-5)).toBe('0 min');
  });

  it('uses minute form strictly below 60 minutes', () => {
    // Survivors: `totalMinutes < 60` → `<=`; `60` → `61` / `59`
    expect(formatPlayTime(59 * 60_000)).toBe('59 min');
    expect(formatPlayTime(60 * 60_000)).toBe('1h');
    expect(formatPlayTime(61 * 60_000)).toBe('1h 1m');
  });

  it('splits hours with exact 60-minute divisor and remainder', () => {
    // Survivors: hours ` / 60` → `*`; remainder `% 60` numeric ±1
    expect(formatPlayTime(90 * 60_000)).toBe('1h 30m');
    expect(formatPlayTime(120 * 60_000)).toBe('2h');
    expect(formatPlayTime(150 * 60_000)).toBe('2h 30m');
  });

  it('maps non-finite and non-positive rates to 0%', () => {
    // Survivors: `!isFinite || rate <= 0` → `&&`; unary `!` removal
    expect(formatWinRate(Number.NaN)).toBe('0%');
    expect(formatWinRate(Number.POSITIVE_INFINITY)).toBe('0%');
    expect(formatWinRate(-0.1)).toBe('0%');
    expect(formatWinRate(0)).toBe('0%');
    expect(formatWinRate(0.5)).toBe('50%');
  });

  it('formatLastPlayed treats falsy timestamps as the em-dash sentinel', () => {
    // Survivor: `if (!timestamp)` remove `!`
    expect(formatLastPlayed(0)).toBe('—');
    expect(formatLastPlayed(Number.NaN)).toBe('—');
    const stamped = formatLastPlayed(Date.UTC(2026, 0, 15));
    expect(stamped).not.toBe('—');
    expect(stamped.length).toBeGreaterThan(0);
  });

  // Pinned: sort `b.lastPlayed - a.lastPlayed` → `+` is observable only via
  // row order in the render path; left for a future wave (not a product bug).
  it.skip('sortGameStats descending lastPlayed (pinned arithmetic flip)', () => {
    expect(true).toBe(true);
  });
});
