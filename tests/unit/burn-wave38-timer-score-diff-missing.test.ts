/**
 * Wave 38 — getScoreDifference missing player leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createScoringState,
  addPlayer,
  addScore,
  removePlayer,
  getScoreDifference,
  getPlayerScore,
} from '../../src/core/timer-scoring';

describe('Wave 38 timer-score — missing diff', () => {
  it('missing player ids yield 0-0 difference', () => {
    const state = createScoringState();
    expect(getScoreDifference(state, 'a', 'b')).toBe(0);
    expect(getPlayerScore(state, 'ghost')).toBe(0);
  });

  it('one missing player treats missing as 0', () => {
    let state = createScoringState();
    state = addPlayer(state, 'p1', 'Alice');
    state = addScore(state, 'p1', 10);
    expect(getScoreDifference(state, 'p1', 'ghost')).toBe(10);
    expect(getScoreDifference(state, 'ghost', 'p1')).toBe(-10);
  });

  it('removePlayer then diff against removed id is signed remaining', () => {
    let state = createScoringState();
    state = addPlayer(state, 'p1', 'A');
    state = addPlayer(state, 'p2', 'B');
    state = addScore(state, 'p1', 7);
    state = addScore(state, 'p2', 3);
    expect(getScoreDifference(state, 'p1', 'p2')).toBe(4);
    state = removePlayer(state, 'p2');
    expect(getScoreDifference(state, 'p1', 'p2')).toBe(7);
  });
});
