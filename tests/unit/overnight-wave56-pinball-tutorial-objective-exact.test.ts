/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Pinball objective title/copy exact.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fractionPinballTutorial } from '../../src/games/fraction-pinball/tutorial';

describe('Wave 56 pinball tutorial — objective', () => {
  it('Objective title and converting leftover', () => {
    const step = fractionPinballTutorial.steps.find((s) => s.id === 'objective');
    expect(step?.title).toBe('Objective');
    expect(step?.position).toBe('center');
    expect(step?.message).toMatch(
      /Score points by correctly converting between fractions and decimals!/
    );
    expect(step?.highlightSelector).toBeUndefined();
  });
});
