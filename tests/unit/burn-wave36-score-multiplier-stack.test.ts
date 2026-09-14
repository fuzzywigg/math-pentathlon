/**
 * Wave 36 — scoring multiplier stack / replace / remove leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  createScoringState,
  addMultiplier,
  removeMultiplier,
  addScore,
  subtractScore,
  getPlayerScore,
  getRecentEntries,
} from '../../src/core/timer-scoring';

describe('Wave 36 score-multipliers — stack product', () => {
  it('applies all multipliers in array order', () => {
    let state = createScoringState({}, ['p1']);
    state = addMultiplier(state, { id: 'x2', name: 'Double', multiplier: 2 });
    state = addMultiplier(state, { id: 'x3', name: 'Triple', multiplier: 3 });
    state = addScore(state, 'p1', 5, 'combo');
    expect(getPlayerScore(state, 'p1')).toBe(30);
    expect(getRecentEntries(state, 'p1', 1)[0]!.amount).toBe(30);
  });

  it('same id replaces prior multiplier rather than stacking dupes', () => {
    let state = createScoringState({}, ['p1']);
    state = addMultiplier(state, { id: 'boost', name: 'A', multiplier: 2 });
    state = addMultiplier(state, { id: 'boost', name: 'B', multiplier: 5 });
    expect(state.multipliers).toHaveLength(1);
    expect(state.multipliers[0]!.name).toBe('B');
    state = addScore(state, 'p1', 4);
    expect(getPlayerScore(state, 'p1')).toBe(20);
  });

  it('removeMultiplier restores raw scoring', () => {
    let state = createScoringState({}, ['p1']);
    state = addMultiplier(state, { id: 'x2', name: 'Double', multiplier: 2 });
    state = addScore(state, 'p1', 3);
    state = removeMultiplier(state, 'x2');
    state = addScore(state, 'p1', 3);
    expect(getPlayerScore(state, 'p1')).toBe(9);
  });

  it('subtractScore also respects multipliers (negative product)', () => {
    let state = createScoringState({ minScore: -1000 }, ['p1']);
    state = addMultiplier(state, { id: 'x2', name: 'Double', multiplier: 2 });
    state = subtractScore(state, 'p1', 4, 'penalty');
    expect(getPlayerScore(state, 'p1')).toBe(-8);
    expect(getRecentEntries(state, 'p1', 1)[0]).toMatchObject({
      amount: -8,
      reason: 'penalty',
    });
  });

  it('zero multiplier zeros the add', () => {
    let state = createScoringState({}, ['p1']);
    state = addMultiplier(state, { id: 'z', name: 'Zero', multiplier: 0 });
    state = addScore(state, 'p1', 99);
    expect(getPlayerScore(state, 'p1')).toBe(0);
  });
});
