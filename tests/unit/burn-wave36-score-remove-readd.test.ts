/**
 * Wave 36 — scoring removePlayer then re-add leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  createScoringState,
  addPlayer,
  removePlayer,
  setScore,
  addScore,
  getPlayerScore,
  getPlayerData,
  getLeaderboard,
  startNewRound,
} from '../../src/core/timer-scoring';

describe('Wave 36 score-remove-readd — roster churn', () => {
  it('re-added player starts at zero without old entries', () => {
    let state = createScoringState({}, ['a', 'b'], { a: 'A', b: 'B' });
    state = setScore(state, 'a', 40);
    state = removePlayer(state, 'a');
    expect(getPlayerData(state, 'a')).toBeUndefined();
    state = addPlayer(state, 'a', 'A-again');
    expect(getPlayerScore(state, 'a')).toBe(0);
    expect(getPlayerData(state, 'a')!.entries).toEqual([]);
    expect(getPlayerData(state, 'a')!.playerName).toBe('A-again');
  });

  it('leaderboard ignores removed players across rounds', () => {
    let state = createScoringState({}, ['a', 'b', 'c']);
    state = setScore(state, 'a', 5);
    state = setScore(state, 'b', 9);
    state = setScore(state, 'c', 7);
    state = startNewRound(state);
    state = removePlayer(state, 'b');
    state = addScore(state, 'c', 10);
    const lb = getLeaderboard(state);
    expect(lb.map((e) => e.playerId)).toEqual(['c', 'a']);
    expect(state.currentRound).toBe(2);
  });
});
