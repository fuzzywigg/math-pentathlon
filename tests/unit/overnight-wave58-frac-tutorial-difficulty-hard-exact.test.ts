/**
 * Overnight TOKENMAXX HEAVY leftovers after #272 — Frac Fact Hard difficulty exact.
 * Wave56 used regex; lock exact strong leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fracFactTutorial } from '../../src/games/frac-fact/tutorial';

describe('Wave 58 frac tutorial — Hard difficulty exact', () => {
  it('Hard bullet exact leftover', () => {
    const step = fracFactTutorial.steps.find((s) => s.id === 'difficulty-levels');
    expect(step?.message).toContain(
      '<strong>Hard:</strong> All operations including division'
    );
  });
});
