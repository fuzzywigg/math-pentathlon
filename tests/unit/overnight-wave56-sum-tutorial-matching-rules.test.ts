/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Sum tutorial matching-rules. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';

describe('Wave 56 sum — tutorial matching rules', () => {
  it('matching-rules example 3+5=8 leftover', () => {
    const step = sumDominoesTutorial.steps.find((s) => s.id === 'matching-rules');
    expect(step?.message).toMatch(/3\+5=8/);
  });
});
