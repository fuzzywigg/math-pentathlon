/**
 * Overnight TOKENMAXX HEAVY leftovers after #260 — Frac Fact welcome strong tag.
 * Wave55 asserted title + score regex only. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fracFactTutorial } from '../../src/games/frac-fact/tutorial';

describe('Wave 57 frac tutorial — welcome strong', () => {
  it('welcome message uses strong Frac Fact leftover', () => {
    const step = fracFactTutorial.steps.find((s) => s.id === 'welcome');
    expect(step?.message).toContain(
      "Let's learn how to play <strong>Frac Fact</strong>!"
    );
    expect(step?.position).toBe('center');
  });
});
