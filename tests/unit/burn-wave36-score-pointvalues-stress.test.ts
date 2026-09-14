/**
 * Wave 36 — scoring pointValues merge stress leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  createScoringState,
  setPointValues,
  getPointValue,
  addScore,
  getPlayerScore,
} from '../../src/core/timer-scoring';

describe('Wave 36 score-pointvalues — merge stress', () => {
  it('repeated setPointValues deep-merges keys', () => {
    let state = createScoringState();
    for (let i = 0; i < 30; i++) {
      state = setPointValues(state, { [`k${i}`]: i, default: i % 5 });
    }
    expect(getPointValue(state, 'k0')).toBe(0);
    expect(getPointValue(state, 'k29')).toBe(29);
    expect(getPointValue(state, 'missing')).toBe(4); // last default
    expect(Object.keys(state.config.pointValues!).length).toBe(31); // 30 + default
  });

  it('awards via getPointValue ladder', () => {
    let state = createScoringState(
      { pointValues: { small: 1, mid: 5, big: 20, default: 2 } },
      ['p1']
    );
    for (const key of ['small', 'mid', 'big', 'other'] as const) {
      state = addScore(state, 'p1', getPointValue(state, key), key);
    }
    expect(getPlayerScore(state, 'p1')).toBe(1 + 5 + 20 + 2);
  });

  it('overwriting a key does not drop siblings', () => {
    let state = createScoringState({ pointValues: { a: 1, b: 2 } });
    state = setPointValues(state, { a: 10 });
    expect(state.config.pointValues).toEqual({ a: 10, b: 2 });
  });
});
