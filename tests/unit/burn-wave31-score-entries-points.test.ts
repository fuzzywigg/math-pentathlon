/**
 * Wave 31 — getRecentEntries ledger + pointValues merge/default matrix.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  createScoringState,
  addScore,
  getRecentEntries,
  getPointValue,
  setPointValues,
} from '../../src/core/timer-scoring';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(100);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('Wave 31 scoring — getRecentEntries', () => {
  it('returns most-recent-first slice and ignores unknown players', () => {
    let state = createScoringState({}, ['p1']);
    for (let i = 1; i <= 5; i++) {
      vi.setSystemTime(100 * i);
      state = addScore(state, 'p1', i, `r${i}`);
    }
    const top3 = getRecentEntries(state, 'p1', 3);
    expect(top3.map((e) => e.reason)).toEqual(['r5', 'r4', 'r3']);
    expect(top3.map((e) => e.amount)).toEqual([5, 4, 3]);

    expect(getRecentEntries(state, 'missing', 5)).toEqual([]);
    expect(getRecentEntries(state, 'p1', 0)).toEqual([]);
    expect(getRecentEntries(state, 'p1', 100)).toHaveLength(5);
  });

  it('does not mutate the underlying entries array order', () => {
    let state = createScoringState({}, ['p1']);
    state = addScore(state, 'p1', 1, 'first');
    state = addScore(state, 'p1', 2, 'second');
    const recent = getRecentEntries(state, 'p1', 2);
    expect(recent[0].reason).toBe('second');
    expect(state.players[0].entries.map((e) => e.reason)).toEqual([
      'first',
      'second',
    ]);
  });
});

describe('Wave 31 scoring — pointValues matrix', () => {
  it('reads configured keys and falls back to default then 0', () => {
    const withDefault = createScoringState({
      pointValues: { capture: 5, default: 1 },
    });
    expect(getPointValue(withDefault, 'capture')).toBe(5);
    expect(getPointValue(withDefault, 'unknown')).toBe(1);

    const bare = createScoringState({ pointValues: { capture: 5 } });
    expect(getPointValue(bare, 'missing')).toBe(0);

    const empty = createScoringState();
    expect(getPointValue(empty, 'anything')).toBe(0);
  });

  it('setPointValues merges without wiping prior keys', () => {
    let state = createScoringState({
      pointValues: { a: 1, b: 2 },
    });
    state = setPointValues(state, { b: 20, c: 3 });
    expect(getPointValue(state, 'a')).toBe(1);
    expect(getPointValue(state, 'b')).toBe(20);
    expect(getPointValue(state, 'c')).toBe(3);
  });

  it('setPointValues creates pointValues when absent', () => {
    let state = createScoringState();
    state = setPointValues(state, { chip: 4 });
    expect(state.config.pointValues).toEqual({ chip: 4 });
    expect(getPointValue(state, 'chip')).toBe(4);
  });

  it('setPointValues does not mutate prior config object', () => {
    const base = createScoringState({ pointValues: { x: 1 } });
    const next = setPointValues(base, { y: 2 });
    expect(base.config.pointValues).toEqual({ x: 1 });
    expect(next.config.pointValues).toEqual({ x: 1, y: 2 });
    expect(next.config).not.toBe(base.config);
  });
});
