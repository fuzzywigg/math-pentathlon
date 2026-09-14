/**
 * Wave 59 leftover after #272 — Pinball common-conversions list exact.
 * Distinct from soft regex. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fractionPinballTutorial } from '../../src/games/fraction-pinball/tutorial';

describe('Wave 59 pinball — tutorial conversions li', () => {
  it('locks all conversion list items', () => {
    const step = fractionPinballTutorial.steps.find(
      (s) => s.id === 'common-conversions'
    );
    expect(step?.title).toBe('Common Conversions');
    expect(step?.message).toContain('<li>1/2 = 0.5</li>');
    expect(step?.message).toContain('<li>1/4 = 0.25, 3/4 = 0.75</li>');
    expect(step?.message).toContain('<li>1/5 = 0.2, 2/5 = 0.4</li>');
    expect(step?.message).toContain('<li>1/8 = 0.125</li>');
  });
});
