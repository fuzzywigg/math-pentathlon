/**
 * Wave 41 — Par 55 calculateScore zero / multi-adj leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  calculateScore,
  getValidPlacements,
} from '../../src/games/par-55/rules';
import {
  countMatchingAttributes,
  createBaseId,
  type AttributeBlock,
  type Par55State,
} from '../../src/games/par-55/types';

describe('Wave 41 par — score zero / multi-adj', () => {
  it('calculateScore empty for unknown base id', () => {
    const state = createInitialState();
    const block = state.hands.player1[0];
    expect(calculateScore(state, block, 'ghost-base')).toEqual({
      totalPoints: 0,
      matchDetails: [],
    });
  });

  it('zero matches yields zero points and empty details', () => {
    const state = createInitialState();
    const centerId = createBaseId(2, 3);
    const centerBlock = state.bases.get(centerId)!.block!;
    // Build a block that shares no attributes with center
    const zeroBlock: AttributeBlock = {
      id: 'zero-match',
      shape: centerBlock.shape === 'circle' ? 'square' : 'circle',
      color: centerBlock.color === 'red' ? 'blue' : 'red',
      size: centerBlock.size === 'small' ? 'large' : 'small',
      thickness: centerBlock.thickness === 'thin' ? 'thick' : 'thin',
    };
    expect(countMatchingAttributes(zeroBlock, centerBlock)).toEqual([]);

    const adjId = state.bases.get(centerId)!.adjacentBases[0];
    const { totalPoints, matchDetails } = calculateScore(
      state,
      zeroBlock,
      adjId
    );
    // May still match other neighbors if any — filter to only center adjacency case:
    // ensure only center is occupied among adjacents of adjId for a clean zero
    const adjBase = state.bases.get(adjId)!;
    const bases = new Map(state.bases);
    for (const nid of adjBase.adjacentBases) {
      if (nid !== centerId) {
        const nb = bases.get(nid)!;
        bases.set(nid, { ...nb, block: null, placedBy: null });
      }
    }
    const isolated: Par55State = { ...state, bases };
    const result = calculateScore(isolated, zeroBlock, adjId);
    expect(result.totalPoints).toBe(0);
    expect(result.matchDetails).toEqual([]);
    // Sanity: original call still returns numbers
    expect(typeof totalPoints).toBe('number');
    expect(Array.isArray(matchDetails)).toBe(true);
  });

  it('multi-adjacent occupied bases accumulate match points', () => {
    const state = createInitialState();
    const centerId = createBaseId(2, 3);
    const center = state.bases.get(centerId)!;
    const centerBlock = center.block!;

    // Place an identical copy on a second neighbor of a shared target
    const targetId = center.adjacentBases[0];
    const target = state.bases.get(targetId)!;
    const secondAdj = target.adjacentBases.find(
      (id) => id !== centerId && !state.bases.get(id)?.block
    );
    expect(secondAdj).toBeTruthy();

    const bases = new Map(state.bases);
    bases.set(secondAdj!, {
      ...bases.get(secondAdj!)!,
      block: { ...centerBlock, id: 'clone-center' },
      placedBy: 'player2',
    });
    const multi: Par55State = { ...state, bases };

    const probe: AttributeBlock = { ...centerBlock, id: 'probe' };
    const { totalPoints, matchDetails } = calculateScore(multi, probe, targetId);
    expect(matchDetails.length).toBeGreaterThanOrEqual(2);
    expect(totalPoints).toBe(
      matchDetails.reduce((s, d) => s + d.points, 0)
    );
    expect(totalPoints).toBeGreaterThanOrEqual(8); // 4 attrs × 2 neighbors
  });

  it('opening valid placement against seed scores matches only', () => {
    const state = createInitialState();
    const block = state.hands.player1[0];
    const baseId = getValidPlacements(state)[0];
    const { totalPoints, matchDetails } = calculateScore(state, block, baseId);
    expect(totalPoints).toBe(
      matchDetails.reduce((s, d) => s + d.points, 0)
    );
  });
});
