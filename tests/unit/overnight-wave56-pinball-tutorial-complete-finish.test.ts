/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Pinball complete Finish CTA.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fractionPinballTutorial } from '../../src/games/fraction-pinball/tutorial';

describe('Wave 56 pinball tutorial — complete Finish', () => {
  it('complete message includes know-how + Finish leftover', () => {
    const step = fractionPinballTutorial.steps.find((s) => s.id === 'complete');
    expect(step?.message).toContain(
      'Now you know how to play Fraction Pinball!'
    );
    expect(step?.message).toContain(
      'Click <strong>Finish</strong> and hit those targets!'
    );
  });
});
