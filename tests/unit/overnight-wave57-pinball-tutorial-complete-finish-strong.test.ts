/**
 * Overnight TOKENMAXX HEAVY leftovers after #260 — Pinball complete Finish strong.
 * Wave55 matched Ready to Play! + /hit those targets/i. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fractionPinballTutorial } from '../../src/games/fraction-pinball/tutorial';

describe('Wave 57 pinball tutorial — complete finish strong', () => {
  it('complete step keeps Now you know + Finish strong leftover', () => {
    const step = fractionPinballTutorial.steps.find((s) => s.id === 'complete');
    expect(step?.message).toContain(
      'Now you know how to play Fraction Pinball!'
    );
    expect(step?.message).toContain(
      'Click <strong>Finish</strong> and hit those targets!'
    );
  });
});
