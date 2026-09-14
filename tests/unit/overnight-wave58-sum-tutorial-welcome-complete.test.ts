/**
 * Wave 58 leftover after #275 — Sum tutorial welcome complete. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';

describe('Wave 58 sum — tutorial welcome complete', () => {
  it('pins leftover', () => {
    const byId = Object.fromEntries(sumDominoesTutorial.steps.map((s) => [s.id, s]));
    expect(byId.welcome?.title).toBe('Welcome to Sum Dominoes & Dice!');
    expect(byId.complete?.title).toBe('Ready to Play!');
    expect(byId.complete?.message).toMatch(/clear your hand/);
  });
});
