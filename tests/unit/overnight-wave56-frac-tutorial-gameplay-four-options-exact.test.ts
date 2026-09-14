/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Frac Fact gameplay four-options copy.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fracFactTutorial } from '../../src/games/frac-fact/tutorial';

describe('Wave 56 frac tutorial — gameplay four options', () => {
  it('gameplay lists Choose the correct answer from 4 options leftover', () => {
    const step = fracFactTutorial.steps.find((s) => s.id === 'gameplay');
    expect(step?.message).toContain(
      'Choose the correct answer from 4 options'
    );
  });
});
