/**
 * Wave 39 — empty leader / game result / recent entries leftovers after #172/#173.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createScoringState,
  addPlayer,
  getLeader,
  calculateGameResult,
  getRecentEntries,
} from '../../src/core/timer-scoring';

describe('Wave 39 score — empty leader result', () => {
  it('getLeader null on empty roster; calculateGameResult null winner', () => {
    const state = createScoringState();
    expect(getLeader(state)).toBeNull();
    const result = calculateGameResult(state, 1000);
    expect(result.winnerId).toBeNull();
    expect(result.winnerName).toBeNull();
    expect(result.isTie).toBe(false);
    expect(result.tiedPlayerIds).toEqual([]);
    expect(result.finalScores).toEqual({});
  });

  it('getRecentEntries ghost → []; duplicate addPlayer noop', () => {
    let state = createScoringState();
    state = addPlayer(state, 'p1', 'Alice');
    const once = state;
    state = addPlayer(state, 'p1', 'Alice2');
    expect(state).toBe(once);
    expect(state.players).toHaveLength(1);
    expect(getRecentEntries(state, 'ghost', 5)).toEqual([]);
  });
});
