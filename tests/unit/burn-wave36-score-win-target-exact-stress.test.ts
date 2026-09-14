/**
 * Wave 36 — scoring target/exact win stress leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  createScoringState,
  addScore,
  setScore,
  checkWinCondition,
  setPointValues,
  getPointValue,
  addPlayer,
} from '../../src/core/timer-scoring';

describe('Wave 36 score-win — target stress ladder', () => {
  it('first to cross target among many players', () => {
    const ids = Array.from({ length: 12 }, (_, i) => `p${i}`);
    let state = createScoringState(
      { winCondition: { type: 'target', value: 50 } },
      ids
    );
    for (let i = 0; i < ids.length; i++) {
      state = setScore(state, ids[i]!, i * 5);
    }
    expect(checkWinCondition(state)).toBe('p10'); // 50
    state = setScore(state, 'p0', 50);
    expect(checkWinCondition(state)).toBe('p0'); // earlier in roster
  });

  it('exact never wins on overshoot even with pointValues helpers', () => {
    let state = createScoringState(
      {
        winCondition: { type: 'exact', value: 21 },
        pointValues: { hit: 7, default: 1 },
      },
      ['p1']
    );
    expect(getPointValue(state, 'hit')).toBe(7);
    expect(getPointValue(state, 'miss')).toBe(1);
    state = addScore(state, 'p1', getPointValue(state, 'hit'));
    state = addScore(state, 'p1', getPointValue(state, 'hit'));
    state = addScore(state, 'p1', getPointValue(state, 'hit'));
    expect(getPointValue(state, 'hit')).toBe(7);
    expect(checkWinCondition(state)).toBe('p1'); // 21 exact
    state = addScore(state, 'p1', getPointValue(state, 'default'));
    expect(checkWinCondition(state)).toBeNull();
  });

  it('setPointValues then getPointValue prefers key over default', () => {
    let state = createScoringState();
    state = setPointValues(state, { default: 2, special: 9 });
    expect(getPointValue(state, 'special')).toBe(9);
    expect(getPointValue(state, 'other')).toBe(2);
    state = addPlayer(state, 'z');
    expect(getPointValue(state, 'missing-when-empty-pv')).toBe(2);
  });

  it('getPointValue is 0 without pointValues map', () => {
    const state = createScoringState({}, ['p']);
    expect(getPointValue(state, 'anything')).toBe(0);
  });
});
