/**
 * Wave 36 — getRecentEntries negative / zero count leftovers.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  createScoringState,
  addScore,
  getRecentEntries,
} from '../../src/core/timer-scoring';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(1_000);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('Wave 36 score-recent — count edges', () => {
  it('negative count uses Array#slice end-relative semantics', () => {
    let state = createScoringState({}, ['p1']);
    state = addScore(state, 'p1', 1, 'a');
    state = addScore(state, 'p1', 2, 'b');
    state = addScore(state, 'p1', 3, 'c');
    // reverse → [c,b,a]; slice(0,-1) → [c,b]
    const neg1 = getRecentEntries(state, 'p1', -1);
    expect(neg1.map((e) => e.reason)).toEqual(['c', 'b']);
    // slice(0,-5) on length-3 → []
    expect(getRecentEntries(state, 'p1', -5)).toEqual([]);
  });

  it('count 1 returns newest first', () => {
    let state = createScoringState({}, ['p1']);
    state = addScore(state, 'p1', 1, 'old');
    vi.setSystemTime(2_000);
    state = addScore(state, 'p1', 2, 'new');
    const recent = getRecentEntries(state, 'p1', 1);
    expect(recent).toHaveLength(1);
    expect(recent[0].reason).toBe('new');
  });
});
