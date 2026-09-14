/**
 * Overnight TOKENMAXX HEAVY leftovers after #272 — Frac Fact Medium difficulty exact.
 * Wave56 used regex; lock exact strong leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fracFactTutorial } from '../../src/games/frac-fact/tutorial';

describe('Wave 58 frac tutorial — Medium difficulty exact', () => {
  it('Medium bullet exact leftover', () => {
    const step = fracFactTutorial.steps.find((s) => s.id === 'difficulty-levels');
    expect(step?.message).toContain(
      '<strong>Medium:</strong> Includes multiplication'
    );
  });
});
