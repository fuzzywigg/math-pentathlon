/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Frac Fact winning copy exact.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fracFactTutorial } from '../../src/games/frac-fact/tutorial';

describe('Wave 56 frac tutorial — winning exact', () => {
  it('winning message includes After 10 problems each leftover', () => {
    const step = fracFactTutorial.steps.find((s) => s.id === 'winning');
    expect(step?.message).toContain(
      'After 10 problems each, the player with the highest score wins!'
    );
  });
});
