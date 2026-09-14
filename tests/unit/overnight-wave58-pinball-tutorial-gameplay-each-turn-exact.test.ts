/**
 * Overnight TOKENMAXX HEAVY leftovers after #272 — Pinball gameplay Each turn exact.
 * Wave56 regex omitted "Each turn," prefix. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fractionPinballTutorial } from '../../src/games/fraction-pinball/tutorial';

describe('Wave 58 pinball tutorial — gameplay each turn', () => {
  it('Each turn convert exact leftover', () => {
    const step = fractionPinballTutorial.steps.find((s) => s.id === 'gameplay');
    expect(step?.message).toContain(
      'Each turn, convert a fraction to decimal or decimal to fraction'
    );
  });
});
