/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — frac-fact × pinball tutorial ids leftover.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fracFactTutorial } from '../../src/games/frac-fact/tutorial';
import { fractionPinballTutorial } from '../../src/games/fraction-pinball/tutorial';

describe('Wave 55 handshake — tutorial ids', () => {
  it('keeps distinct basics ids leftover', () => {
    expect(fracFactTutorial.id).toBe('frac-fact-basics');
    expect(fractionPinballTutorial.id).toBe('fraction-pinball-basics');
    expect(fracFactTutorial.steps).toHaveLength(7);
    expect(fractionPinballTutorial.steps).toHaveLength(7);
  });
});
