/**
 * Overnight TOKENMAXX HEAVY leftovers after #260 — Pinball Scoring title + sentence exact.
 * Wave55 matched point ladder regex; Scoring title never overnight-asserted. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fractionPinballTutorial } from '../../src/games/fraction-pinball/tutorial';

describe('Wave 57 pinball tutorial — scoring sentence', () => {
  it('Scoring title + Different targets award sentence leftover', () => {
    const step = fractionPinballTutorial.steps.find((s) => s.id === 'scoring');
    expect(step?.title).toBe('Scoring');
    expect(step?.highlightSelector).toBe('.pinball-board');
    expect(step?.message).toContain(
      'Different targets award different points: 10, 20, 30, 50, or 100!'
    );
  });
});
