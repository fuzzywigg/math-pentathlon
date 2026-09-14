/**
 * Overnight TOKENMAXX HEAVY leftovers after #272 — Frac Fact scoring streak bonus exact.
 * Wave56 matched loosely; lock exact strong leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fracFactTutorial } from '../../src/games/frac-fact/tutorial';

describe('Wave 58 frac tutorial — scoring streak exact', () => {
  it('Streak bonus consecutive exact leftover', () => {
    const step = fracFactTutorial.steps.find((s) => s.id === 'scoring');
    expect(step?.message).toContain(
      '<strong>Streak bonus:</strong> +5 points per consecutive correct answer'
    );
  });
});
