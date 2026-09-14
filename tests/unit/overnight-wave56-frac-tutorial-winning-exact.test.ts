/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Frac Fact winning copy exact.
 * Wave54 matched /10 problems/. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fracFactTutorial } from '../../src/games/frac-fact/tutorial';

describe('Wave 56 frac tutorial — winning exact', () => {
  it('After 10 problems each highest-score leftover', () => {
    const step = fracFactTutorial.steps.find((s) => s.id === 'winning');
    expect(step?.title).toBe('Winning');
    expect(step?.message).toMatch(
      /After 10 problems each, the player with the highest score wins!/
    );
    expect(step?.position).toBe('center');
  });
});
