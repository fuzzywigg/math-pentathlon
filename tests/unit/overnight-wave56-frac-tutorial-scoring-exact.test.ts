/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Frac Fact scoring tutorial exact.
 * Wave54 matched /10 points/ and /+5/; titles leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fracFactTutorial } from '../../src/games/frac-fact/tutorial';

describe('Wave 56 frac tutorial — scoring exact', () => {
  it('Scoring title + Correct answer / Streak bonus leftovers', () => {
    const step = fracFactTutorial.steps.find((s) => s.id === 'scoring');
    expect(step?.title).toBe('Scoring');
    expect(step?.highlightSelector).toBe('.frac-scores');
    expect(step?.message).toMatch(
      /<strong>Correct answer:<\/strong> 10 points/
    );
    expect(step?.message).toMatch(
      /<strong>Streak bonus:<\/strong> \+5 points per consecutive correct answer/
    );
  });
});
