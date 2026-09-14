/**
 * Wave 36 — addMultiplier replaces same id; remove unknown no-op.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createScoringState,
  addMultiplier,
  removeMultiplier,
  addScore,
  getPlayerScore,
} from '../../src/core/timer-scoring';

describe('Wave 36 score-multipliers — id replace', () => {
  it('re-adding same multiplier id replaces factor', () => {
    let state = createScoringState({}, ['p1']);
    state = addMultiplier(state, { id: 'x2', name: 'Double', multiplier: 2 });
    state = addMultiplier(state, { id: 'x2', name: 'Triple', multiplier: 3 });
    expect(state.multipliers).toHaveLength(1);
    expect(state.multipliers[0].multiplier).toBe(3);
    state = addScore(state, 'p1', 10);
    expect(getPlayerScore(state, 'p1')).toBe(30);
  });

  it('removeMultiplier unknown id is identity', () => {
    let state = createScoringState({}, ['p1']);
    state = addMultiplier(state, { id: 'x2', name: 'Double', multiplier: 2 });
    const next = removeMultiplier(state, 'missing');
    expect(next.multipliers).toHaveLength(1);
  });
});
