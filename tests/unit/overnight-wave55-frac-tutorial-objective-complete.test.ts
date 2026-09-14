/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Frac Fact objective + complete titles.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fracFactTutorial } from '../../src/games/frac-fact/tutorial';

describe('Wave 55 frac tutorial — objective/complete', () => {
  it('objective title and complete Finish CTA leftovers', () => {
    const byId = Object.fromEntries(fracFactTutorial.steps.map((s) => [s.id, s]));
    expect(byId.objective.title).toBe('Objective');
    expect(byId.objective.message).toMatch(/fraction problems/);
    expect(byId.complete.title).toBe('Ready to Play!');
    expect(byId.complete.message).toMatch(/solve those fractions/i);
    expect(byId.winning.title).toBe('Winning');
  });
});
