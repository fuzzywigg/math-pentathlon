/**
 * Wave 39 — calculateGameResult empty / tie leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createScoringState,
  addPlayer,
  addScore,
  calculateGameResult,
  getRecentEntries,
} from '../../src/core/timer-scoring';

describe('Wave 39 score — result empty/tie', () => {
  it('empty players yield null winner non-tie', () => {
    const result = calculateGameResult(createScoringState(), 1200);
    expect(result.winnerId).toBeNull();
    expect(result.isTie).toBe(false);
    expect(result.tiedPlayerIds).toEqual([]);
    expect(result.totalDuration).toBe(1200);
    expect(result.finalScores).toEqual({});
  });

  it('tied tops report isTie with both ids', () => {
    let state = createScoringState();
    state = addPlayer(state, 'a', 'Alice');
    state = addPlayer(state, 'b', 'Bob');
    state = addScore(state, 'a', 5);
    state = addScore(state, 'b', 5);
    const result = calculateGameResult(state, 500);
    expect(result.isTie).toBe(true);
    expect(result.winnerId).toBeNull();
    expect(result.tiedPlayerIds.sort()).toEqual(['a', 'b']);
  });

  it('sole leader wins', () => {
    let state = createScoringState();
    state = addPlayer(state, 'a', 'Alice');
    state = addPlayer(state, 'b', 'Bob');
    state = addScore(state, 'a', 8);
    state = addScore(state, 'b', 3);
    const result = calculateGameResult(state, 99);
    expect(result.isTie).toBe(false);
    expect(result.winnerId).toBe('a');
    expect(result.winnerName).toBe('Alice');
  });

  it('getRecentEntries ghost / zero count', () => {
    let state = createScoringState();
    state = addPlayer(state, 'p1');
    state = addScore(state, 'p1', 1);
    state = addScore(state, 'p1', 2);
    expect(getRecentEntries(state, 'ghost', 5)).toEqual([]);
    expect(getRecentEntries(state, 'p1', 0)).toEqual([]);
    expect(getRecentEntries(state, 'p1', 1)[0].amount).toBe(2);
  });
});
