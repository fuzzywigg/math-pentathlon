/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Pinball winning position bottom.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fractionPinballTutorial } from '../../src/games/fraction-pinball/tutorial';

describe('Wave 56 pinball tutorial — winning position', () => {
  it('winning step position is bottom leftover', () => {
    const step = fractionPinballTutorial.steps.find((s) => s.id === 'winning');
    expect(step?.position).toBe('bottom');
  });
});
