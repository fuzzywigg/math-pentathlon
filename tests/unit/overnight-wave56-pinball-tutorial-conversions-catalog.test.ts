/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Pinball conversions catalog leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fractionPinballTutorial } from '../../src/games/fraction-pinball/tutorial';

describe('Wave 56 pinball tutorial — conversions catalog', () => {
  it('lists 1/4 3/4 1/5 2/5 1/8 leftovers', () => {
    const step = fractionPinballTutorial.steps.find(
      (s) => s.id === 'common-conversions'
    );
    expect(step?.message).toContain('1/4 = 0.25');
    expect(step?.message).toContain('3/4 = 0.75');
    expect(step?.message).toContain('1/5 = 0.2');
    expect(step?.message).toContain('2/5 = 0.4');
    expect(step?.message).toContain('1/8 = 0.125');
  });
});
