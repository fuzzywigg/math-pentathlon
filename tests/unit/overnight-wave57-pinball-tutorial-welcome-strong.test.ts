/**
 * Overnight TOKENMAXX HEAVY leftovers after #260 — Pinball welcome strong tag.
 * Wave55 asserted title only. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fractionPinballTutorial } from '../../src/games/fraction-pinball/tutorial';

describe('Wave 57 pinball tutorial — welcome strong', () => {
  it('welcome message uses strong Fraction Pinball leftover', () => {
    const step = fractionPinballTutorial.steps.find((s) => s.id === 'welcome');
    expect(step?.message).toContain(
      "Let's learn how to play <strong>Fraction Pinball</strong>!"
    );
    expect(step?.position).toBe('center');
  });
});
