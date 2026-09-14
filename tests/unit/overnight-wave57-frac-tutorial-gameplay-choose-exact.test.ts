/**
 * Overnight TOKENMAXX HEAVY leftovers after #260 — Frac Fact choose-from-4 bullet exact.
 * Wave54 matched /4 options/ only. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fracFactTutorial } from '../../src/games/frac-fact/tutorial';

describe('Wave 57 frac tutorial — choose exact', () => {
  it('lists Choose the correct answer from 4 options leftover', () => {
    const step = fracFactTutorial.steps.find((s) => s.id === 'gameplay');
    expect(step?.message).toContain(
      'Choose the correct answer from 4 options'
    );
  });
});
