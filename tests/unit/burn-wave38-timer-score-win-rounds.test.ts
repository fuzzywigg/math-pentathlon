/**
 * Wave 38 — scoring win / rounds / multipliers leftovers after #171.
 * Beyond wave 36 highest/lowest. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createScoringState,
  addPlayer,
  addScore,
  setScore,
  checkWinCondition,
  getLeaderboard,
  getLeader,
  addMultiplier,
  removeMultiplier,
  startNewRound,
  getScoreDifference,
  getRecentEntries,
  resetScores,
} from '../../src/core/timer-scoring';

describe('Wave 38 scoring — target/exact win + rounds', () => {
  it('target win fires at/above threshold; exact requires equality', () => {
    let state = createScoringState({
      winCondition: { type: 'target', value: 10 },
    });
    state = addPlayer(state, 'p1', 'Ada');
    state = addPlayer(state, 'p2', 'Bea');
    state = addScore(state, 'p1', 7);
    expect(checkWinCondition(state)).toBeNull();
    state = addScore(state, 'p1', 3);
    expect(checkWinCondition(state)).toBe('p1');

    let exact = createScoringState({
      winCondition: { type: 'exact', value: 21 },
    });
    exact = addPlayer(exact, 'p1', 'Ada');
    exact = setScore(exact, 'p1', 20);
    expect(checkWinCondition(exact)).toBeNull();
    exact = setScore(exact, 'p1', 21);
    expect(checkWinCondition(exact)).toBe('p1');
    exact = setScore(exact, 'p1', 22);
    expect(checkWinCondition(exact)).toBeNull();
  });

  it('multipliers apply on addScore then removal restores raw increments', () => {
    let state = createScoringState({});
    state = addPlayer(state, 'p1', 'Ada');
    state = addMultiplier(state, { id: 'x2', name: 'Double', multiplier: 2 });
    state = addScore(state, 'p1', 5);
    expect(getLeader(state)?.total).toBe(10);
    state = removeMultiplier(state, 'x2');
    state = addScore(state, 'p1', 5);
    expect(getLeader(state)?.total).toBe(15);
  });

  it('startNewRound increments; resetScores clears totals but keeps roster', () => {
    let state = createScoringState({});
    state = addPlayer(state, 'p1', 'Ada');
    state = addPlayer(state, 'p2', 'Bea');
    state = addScore(state, 'p1', 4);
    state = addScore(state, 'p2', 9);
    state = startNewRound(state);
    expect(state.currentRound).toBe(2);
    expect(getScoreDifference(state, 'p2', 'p1')).toBe(5);
    expect(getRecentEntries(state, 'p2', 1)[0].amount).toBe(9);
    state = resetScores(state);
    expect(getLeaderboard(state).every((p) => p.total === 0)).toBe(true);
    expect(state.players).toHaveLength(2);
  });
});
