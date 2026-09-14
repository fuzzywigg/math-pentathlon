/**
 * Wave 59 leftover after #272 — Pinball gameplay each-turn bullet exact.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fractionPinballTutorial } from '../../src/games/fraction-pinball/tutorial';

describe('Wave 59 pinball — tutorial gameplay each turn', () => {
  it('locks each-turn convert bullet', () => {
    const step = fractionPinballTutorial.steps.find((s) => s.id === 'gameplay');
    expect(step?.message).toContain(
      '<li>Each turn, convert a fraction to decimal or decimal to fraction</li>'
    );
    expect(step?.highlightSelector).toBe('.pinball-challenge');
  });
});
