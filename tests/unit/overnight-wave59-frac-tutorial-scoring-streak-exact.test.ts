/**
 * Wave 59 leftover after #272 — Frac Fact scoring streak bullets exact.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fracFactTutorial } from '../../src/games/frac-fact/tutorial';

describe('Wave 59 frac — tutorial scoring streak', () => {
  it('scoring step locks correct/streak copy', () => {
    const step = fracFactTutorial.steps.find((s) => s.id === 'scoring');
    expect(step?.title).toBe('Scoring');
    expect(step?.message).toContain(
      '<li><strong>Correct answer:</strong> 10 points</li>'
    );
    expect(step?.message).toContain(
      '<li><strong>Streak bonus:</strong> +5 points per consecutive correct answer</li>'
    );
    expect(step?.highlightSelector).toBe('.frac-scores');
  });
});
