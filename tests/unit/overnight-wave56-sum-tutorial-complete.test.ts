/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Sum tutorial complete. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';

describe('Wave 56 sum — tutorial complete', () => {
  it('complete Ready to Play clear your hand leftover', () => {
    const step = sumDominoesTutorial.steps.find((s) => s.id === 'complete');
    expect(step?.title).toBe('Ready to Play!');
    expect(step?.message).toMatch(/clear your hand/);
  });
});
