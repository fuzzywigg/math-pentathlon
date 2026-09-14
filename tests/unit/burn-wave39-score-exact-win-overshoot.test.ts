/**
 * Wave 39 — checkWinCondition exact vs overshoot leftovers.
 * Beyond wave 38 score-diff. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createScoringState,
  addPlayer,
  addScore,
  checkWinCondition,
  getPointValue,
  setPointValues,
} from '../../src/core/timer-scoring';

describe('Wave 39 score — exact win / overshoot', () => {
  it('exact hit wins; overshoot does not', () => {
    let state = createScoringState({
      winCondition: { type: 'exact', value: 10 },
    });
    state = addPlayer(state, 'p1', 'A');
    state = addScore(state, 'p1', 11);
    expect(checkWinCondition(state)).toBeNull();
    state = addPlayer(createScoringState({ winCondition: { type: 'exact', value: 10 } }), 'p1', 'A');
    state = addScore(state, 'p1', 10);
    expect(checkWinCondition(state)).toBe('p1');
  });

  it('target wins on reach-or-exceed', () => {
    let state = createScoringState({
      winCondition: { type: 'target', value: 5 },
    });
    state = addPlayer(state, 'p1');
    state = addScore(state, 'p1', 7);
    expect(checkWinCondition(state)).toBe('p1');
  });

  it('no winCondition yields null', () => {
    let state = createScoringState();
    state = addPlayer(state, 'p1');
    state = addScore(state, 'p1', 100);
    expect(checkWinCondition(state)).toBeNull();
  });

  it('getPointValue falls back to default key', () => {
    let state = createScoringState({
      pointValues: { capture: 3, default: 1 },
    });
    expect(getPointValue(state, 'capture')).toBe(3);
    expect(getPointValue(state, 'ghost')).toBe(1);
    state = setPointValues(state, { ghost: 9 });
    expect(getPointValue(state, 'ghost')).toBe(9);
    expect(getPointValue(createScoringState(), 'x')).toBe(0);
  });
});
