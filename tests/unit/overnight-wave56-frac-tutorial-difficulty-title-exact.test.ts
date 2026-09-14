/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Frac Fact difficulty title exact.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fracFactTutorial } from '../../src/games/frac-fact/tutorial';

describe('Wave 56 frac tutorial — Difficulty Levels title', () => {
  it('title is exact Difficulty Levels leftover', () => {
    const step = fracFactTutorial.steps.find(
      (s) => s.id === 'difficulty-levels'
    );
    expect(step?.title).toBe('Difficulty Levels');
  });
});
