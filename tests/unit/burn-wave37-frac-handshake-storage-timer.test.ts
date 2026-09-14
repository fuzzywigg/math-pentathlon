/**
 * Wave 37 — fraction arithmetic × timer format × storage duration handshake.
 * Fractions-primary leftover bridge; not #166 storage/timer deepen, not #164 UI.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  createFraction,
  add,
  multiply,
  toDecimal,
  simplify,
  areEqual,
  formatFraction,
} from '../../src/core/fractions';
import { formatTime, parseTime } from '../../src/core/timer-scoring';
import { storage } from '../../src/core/storage';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-09-14T20:00:00Z'));
  localStorage.clear();
  storage.resetAll();
});

afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
  storage.resetAll();
  vi.restoreAllMocks();
});

describe('Wave 37 frac-handshake — score-like duration from fractions', () => {
  it('fraction of a minute converts through formatTime into storage', () => {
    // 3/4 of a minute = 45000 ms
    const frac = simplify(multiply(createFraction(3, 4), createFraction(60_000, 1)));
    // multiply keeps raw; use toDecimal path
    const ms = Math.round(toDecimal(createFraction(3, 4)) * 60_000);
    expect(ms).toBe(45_000);
    expect(formatTime(ms)).toBe('00:45');
    expect(parseTime(formatTime(ms))).toBe(ms);

    storage.recordGameResult({
      gameId: 'frac-timed',
      winner: 'player1',
      playerWon: true,
      duration: ms,
      moveCount: 3,
      playedAt: Date.now(),
    });
    expect(storage.getGameStats('frac-timed').totalPlayTime).toBe(45_000);

    // arithmetic leftover: 1/4 + 1/2 = 3/4
    expect(
      areEqual(
        simplify(add(createFraction(1, 4), createFraction(1, 2))),
        createFraction(3, 4)
      )
    ).toBe(true);
    expect(formatFraction(createFraction(3, 4), { useUnicodeFractions: true })).toBe(
      '¾'
    );
    expect(frac.denominator).toBeGreaterThan(0);
  });
});
