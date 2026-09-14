/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Sum tutorial passing/strategy. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';

describe('Wave 56 sum — tutorial passing strategy', () => {
  it('passing consecutive + strategy sum 7 leftover', () => {
    const passing = sumDominoesTutorial.steps.find((s) => s.id === 'passing');
    expect(passing?.message).toMatch(/both players pass consecutively/);
    expect(passing?.message).toMatch(/fewer total pips/);
    const strategy = sumDominoesTutorial.steps.find((s) => s.id === 'strategy-tips');
    expect(strategy?.message).toMatch(/7 is the most common/);
  });
});
