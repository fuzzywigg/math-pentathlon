/**
 * Wave 57 leftover after #267 — Sum tutorial id/name. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';

describe('Wave 57 sum — tutorial id name', () => {
  it('pins sum-dominoes-basics id and Learn name', () => {
    expect(sumDominoesTutorial.id).toBe('sum-dominoes-basics');
    expect(sumDominoesTutorial.name).toBe('Learn Sum Dominoes & Dice');
  });
});
