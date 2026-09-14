/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Pinball common-conversions catalog.
 * Wave52 only asserted 1/2 = 0.5. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fractionPinballTutorial } from '../../src/games/fraction-pinball/tutorial';

describe('Wave 56 pinball tutorial — conversions catalog', () => {
  it('lists 1/4 3/4 1/5 1/8 leftovers', () => {
    const step = fractionPinballTutorial.steps.find(
      (s) => s.id === 'common-conversions'
    );
    expect(step?.title).toBe('Common Conversions');
    expect(step?.position).toBe('center');
    expect(step?.message).toMatch(/1\/4 = 0\.25/);
    expect(step?.message).toMatch(/3\/4 = 0\.75/);
    expect(step?.message).toMatch(/1\/5 = 0\.2/);
    expect(step?.message).toMatch(/2\/5 = 0\.4/);
    expect(step?.message).toMatch(/1\/8 = 0\.125/);
  });
});
