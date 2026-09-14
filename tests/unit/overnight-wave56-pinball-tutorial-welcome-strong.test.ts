/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Pinball welcome strong brand.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fractionPinballTutorial } from '../../src/games/fraction-pinball/tutorial';

describe('Wave 56 pinball tutorial — welcome strong', () => {
  it('welcome wraps Fraction Pinball in strong leftover', () => {
    const step = fractionPinballTutorial.steps.find((s) => s.id === 'welcome');
    expect(step?.message).toContain('<strong>Fraction Pinball</strong>');
    expect(step?.message).toContain("Let's learn how to play");
  });
});
