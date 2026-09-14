/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Pinball winning copy exact.
 * Wave55 matched /most points after all rounds/i. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fractionPinballTutorial } from '../../src/games/fraction-pinball/tutorial';

describe('Wave 56 pinball tutorial — winning exact', () => {
  it('Winning title + most points after all rounds leftover', () => {
    const step = fractionPinballTutorial.steps.find((s) => s.id === 'winning');
    expect(step?.title).toBe('Winning');
    expect(step?.highlightSelector).toBe('.pinball-scores');
    expect(step?.position).toBe('bottom');
    expect(step?.message).toMatch(
      /Player with the most points after all rounds wins!/
    );
  });
});
