/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Pinball tutorial objective title.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fractionPinballTutorial } from '../../src/games/fraction-pinball/tutorial';

describe('Wave 56 pinball tutorial — objective', () => {
  it('objective title/position/copy leftover', () => {
    const step = fractionPinballTutorial.steps.find((s) => s.id === 'objective');
    expect(step?.title).toBe('Objective');
    expect(step?.position).toBe('center');
    expect(step?.message).toContain(
      'Score points by correctly converting between fractions and decimals!'
    );
  });
});
