/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Pinball scoring 10/20/30/50/100 copy.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fractionPinballTutorial } from '../../src/games/fraction-pinball/tutorial';

describe('Wave 55 pinball tutorial — scoring values', () => {
  it('lists target point leftover catalog', () => {
    const scoring = fractionPinballTutorial.steps.find((s) => s.id === 'scoring');
    expect(scoring?.message).toMatch(/10, 20, 30, 50, or 100/);
    const gameplay = fractionPinballTutorial.steps.find((s) => s.id === 'gameplay');
    expect(gameplay?.message).toMatch(/lose a ball/i);
    const winning = fractionPinballTutorial.steps.find((s) => s.id === 'winning');
    expect(winning?.message).toMatch(/most points after all rounds/i);
  });
});
