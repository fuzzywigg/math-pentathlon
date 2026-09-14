/**
 * Overnight HEAVY leftover after #234 — Pinball tutorial common-conversions step.
 * Wiring tests cover gameplay/scoring/winning only. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fractionPinballTutorial } from '../../src/games/fraction-pinball/tutorial';

describe('Wave 52 pinball — tutorial conversions', () => {
  it('exposes common-conversions step with 1/2 = 0.5', () => {
    const step = fractionPinballTutorial.steps.find(
      (s) => s.id === 'common-conversions'
    );
    expect(step).toBeTruthy();
    expect(step!.title).toMatch(/Common Conversions/i);
    expect(step!.message).toMatch(/1\/2 = 0\.5/);
  });
});
