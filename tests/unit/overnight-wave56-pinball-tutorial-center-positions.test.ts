/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Pinball tutorial center positions.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fractionPinballTutorial } from '../../src/games/fraction-pinball/tutorial';

describe('Wave 56 pinball tutorial — center positions', () => {
  it('welcome/objective/conversions/complete are center leftover', () => {
    for (const id of [
      'welcome',
      'objective',
      'common-conversions',
      'complete',
    ]) {
      const step = fractionPinballTutorial.steps.find((s) => s.id === id);
      expect(step?.position).toBe('center');
    }
  });
});
