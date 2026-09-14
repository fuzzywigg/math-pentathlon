/**
 * Wave 31 — startNewRound / getScoreDifference multi-seat matrix.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  createScoringState,
  addScore,
  setScore,
  startNewRound,
  getScoreDifference,
  resetScores,
  getPlayerScore,
} from '../../src/core/timer-scoring';

describe('Wave 31 scoring — rounds', () => {
  it('increments currentRound without touching scores', () => {
    let state = createScoringState({}, ['p1', 'p2']);
    state = addScore(state, 'p1', 11);
    state = addScore(state, 'p2', 22);
    expect(state.currentRound).toBe(1);

    state = startNewRound(state);
    expect(state.currentRound).toBe(2);
    expect(getPlayerScore(state, 'p1')).toBe(11);
    expect(getPlayerScore(state, 'p2')).toBe(22);

    state = startNewRound(state);
    state = startNewRound(state);
    expect(state.currentRound).toBe(4);
  });

  it('resetScores does not reset currentRound', () => {
    let state = createScoringState({}, ['p1']);
    state = startNewRound(state);
    state = startNewRound(state);
    state = addScore(state, 'p1', 5);
    state = resetScores(state);
    expect(state.currentRound).toBe(3);
    expect(getPlayerScore(state, 'p1')).toBe(0);
  });
});

describe('Wave 31 scoring — getScoreDifference matrix', () => {
  it('computes signed differences across seats including unknowns', () => {
    let state = createScoringState({}, ['a', 'b', 'c']);
    state = setScore(state, 'a', 30);
    state = setScore(state, 'b', 10);
    state = setScore(state, 'c', 30);

    expect(getScoreDifference(state, 'a', 'b')).toBe(20);
    expect(getScoreDifference(state, 'b', 'a')).toBe(-20);
    expect(getScoreDifference(state, 'a', 'c')).toBe(0);
    expect(getScoreDifference(state, 'a', 'missing')).toBe(30);
    expect(getScoreDifference(state, 'missing', 'a')).toBe(-30);
    expect(getScoreDifference(state, 'ghost1', 'ghost2')).toBe(0);
  });

  it('reflects live score updates', () => {
    let state = createScoringState({}, ['p1', 'p2']);
    expect(getScoreDifference(state, 'p1', 'p2')).toBe(0);
    state = addScore(state, 'p1', 5);
    expect(getScoreDifference(state, 'p1', 'p2')).toBe(5);
    state = addScore(state, 'p2', 8);
    expect(getScoreDifference(state, 'p1', 'p2')).toBe(-3);
  });
});
