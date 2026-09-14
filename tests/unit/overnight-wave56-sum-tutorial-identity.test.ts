/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Sum tutorial identity. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';

describe('Wave 56 sum — tutorial identity', () => {
  it('catalog id/name leftover', () => {
    expect(sumDominoesTutorial.id).toBe('sum-dominoes-basics');
    expect(sumDominoesTutorial.name).toBe('Learn Sum Dominoes & Dice');
  });
});
