/**
 * Wave 31 — multiplier stack / replace / interaction with clamps.
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

describe('Wave 31 scoring — multiplier product stack', () => {
  it('applies multipliers in array order as a product', () => {
    let state = createScoringState({}, ['p1']);
    state = addMultiplier(state, { id: 'x2', name: 'Double', multiplier: 2 });
    state = addMultiplier(state, { id: 'x3', name: 'Triple', multiplier: 3 });
    state = addScore(state, 'p1', 4);
    expect(getPlayerScore(state, 'p1')).toBe(24); // 4 * 2 * 3
    expect(getRecentEntries(state, 'p1', 1)[0].amount).toBe(24);
  });

  it('replaces same id rather than stacking duplicates', () => {
    let state = createScoringState({}, ['p1']);
    state = addMultiplier(state, { id: 'boost', name: 'v1', multiplier: 2 });
    state = addMultiplier(state, { id: 'boost', name: 'v2', multiplier: 5 });
    expect(state.multipliers).toHaveLength(1);
    expect(state.multipliers[0].name).toBe('v2');
    state = addScore(state, 'p1', 3);
    expect(getPlayerScore(state, 'p1')).toBe(15);
  });

  it('removeMultiplier leaves other boosts intact', () => {
    let state = createScoringState({}, ['p1']);
    state = addMultiplier(state, { id: 'a', name: 'A', multiplier: 2 });
    state = addMultiplier(state, { id: 'b', name: 'B', multiplier: 4 });
    state = removeMultiplier(state, 'a');
    expect(state.multipliers.map((m) => m.id)).toEqual(['b']);
    state = addScore(state, 'p1', 2);
    expect(getPlayerScore(state, 'p1')).toBe(8);
  });

  it('remove unknown id is a no-op structurally', () => {
    let state = createScoringState({}, ['p1']);
    state = addMultiplier(state, { id: 'keep', name: 'K', multiplier: 2 });
    const next = removeMultiplier(state, 'missing');
    expect(next.multipliers).toEqual(state.multipliers);
    expect(next).not.toBe(state);
  });
});

describe('Wave 31 scoring — multipliers + clamp', () => {
  it('scales then clamps to maxScore', () => {
    let state = createScoringState({ maxScore: 30 }, ['p1']);
    state = addMultiplier(state, { id: 'x10', name: 'Ten', multiplier: 10 });
    state = addScore(state, 'p1', 5); // 50 → clamp 30
    expect(getPlayerScore(state, 'p1')).toBe(30);
    expect(getRecentEntries(state, 'p1', 1)[0].amount).toBe(50);
  });

  it('fractional multipliers apply to subtractScore', () => {
    let state = createScoringState({ minScore: -100 }, ['p1']);
    state = addScore(state, 'p1', 20);
    state = addMultiplier(state, { id: 'half', name: 'Half', multiplier: 0.5 });
    state = subtractScore(state, 'p1', 10); // effective -5
    expect(getPlayerScore(state, 'p1')).toBe(15);
  });

  it('zero multiplier nullifies subsequent adds', () => {
    let state = createScoringState({}, ['p1']);
    state = addScore(state, 'p1', 7);
    state = addMultiplier(state, { id: 'z', name: 'Zero', multiplier: 0 });
    state = addScore(state, 'p1', 100);
    expect(getPlayerScore(state, 'p1')).toBe(7);
  });
});

describe('Wave 31 scoring — multiplier immutability', () => {
  it('addMultiplier does not mutate prior multipliers array', () => {
    const base = createScoringState({}, ['p1']);
    const withOne = addMultiplier(base, {
      id: 'x2',
      name: 'Double',
      multiplier: 2,
    });
    expect(base.multipliers).toEqual([]);
    expect(withOne.multipliers).toHaveLength(1);
    expect(withOne).not.toBe(base);
  });
});
