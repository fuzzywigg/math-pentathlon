/**
 * Wave 45 — Par 55 calculateScore zero-match adjacency leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, calculateScore, getValidPlacements } from '../../src/games/par-55/rules';
import type { AttributeBlock } from '../../src/games/par-55/types';

describe('Wave 45 par — zero match score', () => {
  it('adjacent occupied with 0 shared attrs yields 0 points', () => {
    const state = createInitialState();
    const center = [...state.bases.values()].find((b) => b.block)!;
    const opposite: AttributeBlock = {
      id: 'opp',
      shape: center.block!.shape === 'circle' ? 'square' : 'circle',
      color: center.block!.color === 'red' ? 'blue' : 'red',
      size: center.block!.size === 'small' ? 'large' : 'small',
      thickness: center.block!.thickness === 'thin' ? 'thick' : 'thin',
    };
    const target = getValidPlacements(state)[0];
    const { totalPoints, matchDetails } = calculateScore(state, opposite, target);
    expect(totalPoints).toBe(0);
    expect(matchDetails).toEqual([]);
  });
});
