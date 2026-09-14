/**
 * Overnight TOKENMAXX HEAVY leftovers after #272 — Frac Fact Easy difficulty exact.
 * Wave56 regex stopped before "with simple fractions". Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fracFactTutorial } from '../../src/games/frac-fact/tutorial';

describe('Wave 58 frac tutorial — Easy difficulty exact', () => {
  it('Easy bullet includes with simple fractions leftover', () => {
    const step = fracFactTutorial.steps.find((s) => s.id === 'difficulty-levels');
    expect(step?.message).toContain(
      '<strong>Easy:</strong> Addition and subtraction with simple fractions'
    );
  });
});
