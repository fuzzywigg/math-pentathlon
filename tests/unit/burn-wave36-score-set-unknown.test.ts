/**
 * Wave 36 — setScore / subtractScore unknown player leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createScoringState,
  setScore,
  subtractScore,
  addScore,
  getPlayerScore,
  getPlayerData,
} from '../../src/core/timer-scoring';

describe('Wave 36 score-unknown — set/subtract no-ops', () => {
  it('setScore on missing id leaves roster unchanged', () => {
    const state = createScoringState({}, ['p1'], { p1: 'Ada' });
    const next = setScore(state, 'ghost', 50);
    expect(next.players).toHaveLength(1);
    expect(getPlayerScore(next, 'ghost')).toBe(0);
    expect(getPlayerData(next, 'ghost')).toBeUndefined();
    expect(getPlayerScore(next, 'p1')).toBe(0);
  });

  it('subtractScore on missing id is a no-op', () => {
    let state = createScoringState({}, ['p1']);
    state = addScore(state, 'p1', 10);
    const next = subtractScore(state, 'nope', 5);
    expect(getPlayerScore(next, 'p1')).toBe(10);
    expect(next.players).toHaveLength(1);
  });
});
