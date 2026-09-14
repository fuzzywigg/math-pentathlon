/**
 * Wave 60 leftover after #282 — Sum welcome learn-how copy. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';

describe('Wave 60 sum — tutorial welcome learn copy', () => {
  it('pins learn-how-to-play body leftover', () => {
    const byId = Object.fromEntries(sumDominoesTutorial.steps.map((s) => [s.id, s]));
    expect(byId.welcome?.message).toMatch(/Let's learn how to play/);
    expect(byId.welcome?.message).toMatch(/Sum Dominoes & Dice/);
  });
});
