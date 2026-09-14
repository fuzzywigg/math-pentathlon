/**
 * Overnight TOKENMAXX HEAVY leftovers after #260 — Pinball gameplay correct-hit bullet exact.
 * Wave56 matched wrong-ball; correct-hit bullet never exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fractionPinballTutorial } from '../../src/games/fraction-pinball/tutorial';

describe('Wave 57 pinball tutorial — gameplay correct hit', () => {
  it('lists Correct answers hit pinball targets for points leftover', () => {
    const step = fractionPinballTutorial.steps.find((s) => s.id === 'gameplay');
    expect(step?.message).toContain(
      'Correct answers hit pinball targets for points'
    );
  });
});
