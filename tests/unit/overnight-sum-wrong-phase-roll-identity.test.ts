/**
 * Overnight HEAVY after #214/#215 — Sum Dominoes wrong-phase roll identity. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, doRollDice } from '../../src/games/sum-dominoes/rules';

describe('Overnight sum-dominoes — roll identity', () => {
  it('non-rolling phases are identity', () => {
    const s = createInitialState();
    for (const phase of ['placing', 'passing', 'gameOver'] as const) {
      const locked = { ...s, phase };
      expect(doRollDice(locked)).toBe(locked);
    }
  });
});
