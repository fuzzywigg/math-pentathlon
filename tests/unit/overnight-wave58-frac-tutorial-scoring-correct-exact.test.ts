/**
 * Overnight TOKENMAXX HEAVY leftovers after #272 — Frac Fact scoring Correct answer exact.
 * Wave56 matched loosely; lock exact strong leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fracFactTutorial } from '../../src/games/frac-fact/tutorial';

describe('Wave 58 frac tutorial — scoring correct exact', () => {
  it('Correct answer 10 points exact leftover', () => {
    const step = fracFactTutorial.steps.find((s) => s.id === 'scoring');
    expect(step?.message).toContain(
      '<strong>Correct answer:</strong> 10 points'
    );
  });
});
