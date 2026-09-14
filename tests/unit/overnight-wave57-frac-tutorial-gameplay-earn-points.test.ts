/**
 * Overnight TOKENMAXX HEAVY leftovers after #260 — Frac Fact earn-points bullet leftover.
 * Prior waves never matched this list item. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fracFactTutorial } from '../../src/games/frac-fact/tutorial';

describe('Wave 57 frac tutorial — earn points', () => {
  it('lists Earn points for correct answers leftover', () => {
    const step = fracFactTutorial.steps.find((s) => s.id === 'gameplay');
    expect(step?.message).toContain('Earn points for correct answers');
  });
});
