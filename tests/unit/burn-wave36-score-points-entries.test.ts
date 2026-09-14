/**
 * Wave 36 — scoring pointValues / recent entries / difference leftovers.
 * Beyond wave 31 entries-points / rounds-diff. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  createScoringState,
  addScore,
  setPointValues,
  getPointValue,
  getRecentEntries,
  getScoreDifference,
  getPlayerData,
  resetScores,
} from '../../src/core/timer-scoring';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(100);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('Wave 36 scoring — pointValues merge matrix', () => {
  it('merges keys and keeps prior values for untouched keys', () => {
    let state = createScoringState({
      pointValues: { hit: 5, miss: 0, default: 1 },
    });
    expect(getPointValue(state, 'hit')).toBe(5);
    expect(getPointValue(state, 'unknown')).toBe(1);

    state = setPointValues(state, { hit: 8, bonus: 12 });
    expect(getPointValue(state, 'hit')).toBe(8);
    expect(getPointValue(state, 'miss')).toBe(0);
    expect(getPointValue(state, 'bonus')).toBe(12);
    expect(getPointValue(state, 'still-unknown')).toBe(1);
  });

  it('absent pointValues yields 0 for any key', () => {
    const state = createScoringState({});
    expect(getPointValue(state, 'hit')).toBe(0);
    expect(getPointValue(state, 'default')).toBe(0);
  });

  it('default-only catalog returns default for misses', () => {
    const state = createScoringState({ pointValues: { default: 3 } });
    expect(getPointValue(state, 'anything')).toBe(3);
    expect(getPointValue(state, 'default')).toBe(3);
  });
});

describe('Wave 36 scoring — getRecentEntries order and bounds', () => {
  it('returns most recent first and respects count', () => {
    let state = createScoringState({}, ['p1']);
    for (let i = 0; i < 5; i++) {
      vi.setSystemTime(100 + i * 10);
      state = addScore(state, 'p1', i + 1, `r${i}`);
    }
    const recent = getRecentEntries(state, 'p1', 3);
    expect(recent.map((e) => e.reason)).toEqual(['r4', 'r3', 'r2']);
    expect(recent.map((e) => e.amount)).toEqual([5, 4, 3]);
    expect(getRecentEntries(state, 'p1', 100)).toHaveLength(5);
    expect(getRecentEntries(state, 'missing', 3)).toEqual([]);
  });

  it('does not mutate underlying entries when reversing', () => {
    let state = createScoringState({}, ['p1']);
    state = addScore(state, 'p1', 1, 'a');
    state = addScore(state, 'p1', 2, 'b');
    getRecentEntries(state, 'p1', 2);
    expect(getPlayerData(state, 'p1')!.entries.map((e) => e.reason)).toEqual([
      'a',
      'b',
    ]);
  });
});

describe('Wave 36 scoring — getScoreDifference matrix', () => {
  it('computes signed differences across seats including unknowns', () => {
    let state = createScoringState({}, ['a', 'b', 'c']);
    state = addScore(state, 'a', 20);
    state = addScore(state, 'b', 5);
    state = addScore(state, 'c', 20);
    expect(getScoreDifference(state, 'a', 'b')).toBe(15);
    expect(getScoreDifference(state, 'b', 'a')).toBe(-15);
    expect(getScoreDifference(state, 'a', 'c')).toBe(0);
    expect(getScoreDifference(state, 'a', 'ghost')).toBe(20);
    expect(getScoreDifference(state, 'ghost', 'a')).toBe(-20);
  });

  it('after resetScores differences are zero', () => {
    let state = createScoringState({}, ['a', 'b']);
    state = addScore(state, 'a', 9);
    state = addScore(state, 'b', 3);
    state = resetScores(state);
    expect(getScoreDifference(state, 'a', 'b')).toBe(0);
  });
});
