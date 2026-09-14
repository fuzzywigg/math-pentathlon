/**
 * Wave 59 leftover after #272 — Pinball welcome convert paragraph.
 * Distinct from wave57 strong Fraction Pinball tag. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fractionPinballTutorial } from '../../src/games/fraction-pinball/tutorial';

describe('Wave 59 pinball — tutorial welcome convert p', () => {
  it('welcome includes convert score paragraph', () => {
    const step = fractionPinballTutorial.steps.find((s) => s.id === 'welcome');
    expect(step?.message).toContain(
      '<p>Score points by correctly converting between fractions and decimals!</p>'
    );
  });
});
