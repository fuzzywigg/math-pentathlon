/**
 * Wave 46 — Par 55 calculateScore multi-attr match (non-zero) leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, calculateScore, getValidPlacements } from '../../src/games/par-55/rules';

describe('Wave 46 par — multi-attr score', () => {
  it('identical-to-seed block at valid base scores > 0', () => {
    const state = createInitialState();
    const seed = [...state.bases.values()].find((b) => b.block)!.block!;
    const twin = { ...seed, id: 'twin-score' };
    const target = getValidPlacements(state)[0];
    const { totalPoints, matchDetails } = calculateScore(state, twin, target);
    expect(totalPoints).toBeGreaterThan(0);
    expect(matchDetails.length).toBeGreaterThan(0);
    expect(matchDetails[0].matchingAttributes.length).toBeGreaterThan(0);
  });
});
