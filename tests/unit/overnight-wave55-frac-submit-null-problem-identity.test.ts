/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Frac Fact submitAnswer null problem identity.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { submitAnswer } from '../../src/games/frac-fact/rules';

describe('Wave 55 frac rules — submit null problem', () => {
  it('returns same object when currentProblem is null', () => {
    const open = createInitialState('medium');
    expect(open.currentProblem).toBeNull();
    const next = submitAnswer(open, { numerator: 1, denominator: 2 });
    expect(next).toBe(open);
  });
});
