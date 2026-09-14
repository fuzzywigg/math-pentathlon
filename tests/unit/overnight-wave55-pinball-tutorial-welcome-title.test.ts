/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Pinball welcome title leftover.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fractionPinballTutorial } from '../../src/games/fraction-pinball/tutorial';

describe('Wave 55 pinball tutorial — welcome', () => {
  it('welcome title and converting copy leftover', () => {
    const step = fractionPinballTutorial.steps.find((s) => s.id === 'welcome');
    expect(step?.title).toBe('Welcome to Fraction Pinball!');
    expect(step?.message).toMatch(/converting between fractions and decimals/i);
    expect(fractionPinballTutorial.id).toBe('fraction-pinball-basics');
    expect(fractionPinballTutorial.name).toBe('Learn Fraction Pinball');
  });
});
