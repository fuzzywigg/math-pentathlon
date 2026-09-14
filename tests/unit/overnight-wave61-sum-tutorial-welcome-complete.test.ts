/**
 * Wave 61 Contig/SD residual — Sum tutorial welcome + complete copy. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';

describe('Wave 61 sum — tutorial welcome/complete', () => {
  it('pins welcome rid-of-dominoes and complete clear-hand copy', () => {
    const welcome = sumDominoesTutorial.steps.find((s) => s.id === 'welcome');
    const complete = sumDominoesTutorial.steps.find((s) => s.id === 'complete');
    expect(welcome?.title).toMatch(/Welcome to Sum Dominoes/);
    expect(welcome?.message).toMatch(/get rid of all your dominoes/);
    expect(complete?.title).toBe('Ready to Play!');
    expect(complete?.message).toMatch(/clear your hand/);
  });
});
