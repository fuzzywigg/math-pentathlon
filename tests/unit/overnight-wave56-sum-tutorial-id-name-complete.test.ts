/**
 * Wave 56 leftover after #243 — Sum Dominoes tutorial identity residual.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';

describe('Wave 56 sum — tutorial id name complete', () => {
  it('keeps id/name and clear-your-hand complete copy', () => {
    expect(sumDominoesTutorial.id).toBe('sum-dominoes-basics');
    expect(sumDominoesTutorial.name).toBe('Learn Sum Dominoes & Dice');
    const complete = sumDominoesTutorial.steps.find((s) => s.id === 'complete');
    expect(complete?.message).toMatch(/clear your hand/);
    expect(complete?.message).toMatch(/Finish/);
  });
});
