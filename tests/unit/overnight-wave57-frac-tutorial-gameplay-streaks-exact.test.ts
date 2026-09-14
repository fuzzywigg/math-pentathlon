/**
 * Overnight TOKENMAXX HEAVY leftovers after #260 — Frac Fact gameplay streak bullet exact.
 * Wave55 matched /streaks/; full Build streaks bullet unasserted. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fracFactTutorial } from '../../src/games/frac-fact/tutorial';

describe('Wave 57 frac tutorial — gameplay streaks', () => {
  it('lists Build streaks for bonus points! leftover', () => {
    const step = fracFactTutorial.steps.find((s) => s.id === 'gameplay');
    expect(step?.message).toContain('Build streaks for bonus points!');
    expect(step?.highlightSelector).toBe('.frac-problem');
  });
});
