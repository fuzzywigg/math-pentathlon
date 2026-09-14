/**
 * Overnight HEAVY leftover after #234 — Frac Fact tutorial difficulty-levels step.
 * Wiring tests cover gameplay/scoring/winning only. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fracFactTutorial } from '../../src/games/frac-fact/tutorial';

describe('Wave 52 frac — tutorial difficulty', () => {
  it('exposes difficulty-levels with Easy/Medium/Hard copy', () => {
    const step = fracFactTutorial.steps.find((s) => s.id === 'difficulty-levels');
    expect(step).toBeTruthy();
    expect(step!.title).toMatch(/Difficulty/i);
    expect(step!.message).toMatch(/Easy/);
    expect(step!.message).toMatch(/Medium/);
    expect(step!.message).toMatch(/Hard/);
  });
});
