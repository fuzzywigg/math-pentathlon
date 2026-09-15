/**
 * Wave 66 leftover after tip/#316 — Sum welcome strong name exact.
 * Soft welcome learn copy existed; lock <strong>Sum Dominoes & Dice</strong>. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';

describe('Wave 66 sum — tutorial welcome strong', () => {
  it('welcome uses exact strong Sum Dominoes & Dice markup', () => {
    const step = sumDominoesTutorial.steps.find((s) => s.id === 'welcome');
    expect(step?.message).toContain('<strong>Sum Dominoes & Dice</strong>');
    expect(step?.title).toBe('Welcome to Sum Dominoes & Dice!');
  });
});
