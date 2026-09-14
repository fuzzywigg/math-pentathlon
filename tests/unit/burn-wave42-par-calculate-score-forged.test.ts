/**
 * Wave 42 — Par 55 calculateScore forged neighbors leftovers after #186. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createInitialState, calculateScore } from '../../src/games/par-55/rules';
import {
  createBaseId,
  countMatchingAttributes,
  type AttributeBlock,
  type Par55State,
} from '../../src/games/par-55/types';

describe('Wave 42 par — calculateScore forged neighbors', () => {
  it('single neighbor with 4 matching attrs yields 4 points', () => {
    const state = createInitialState();
    const centerId = createBaseId(2, 3);
    const centerBlock = state.bases.get(centerId)!.block!;
    const targetId = state.bases.get(centerId)!.adjacentBases[0];

    const probe: AttributeBlock = { ...centerBlock, id: 'four-match' };
    const { totalPoints, matchDetails } = calculateScore(state, probe, targetId);
    expect(totalPoints).toBe(4);
    expect(matchDetails).toHaveLength(1);
    expect(matchDetails[0].matchingAttributes).toHaveLength(4);
    expect(matchDetails[0].points).toBe(4);
  });

  it('two forged neighbors with different match counts sum independently', () => {
    const state = createInitialState();
    const centerId = createBaseId(2, 3);
    const centerBlock = state.bases.get(centerId)!.block!;
    const targetId = state.bases.get(centerId)!.adjacentBases[0];
    const target = state.bases.get(targetId)!;

    const secondAdj = target.adjacentBases.find(
      (id) => id !== centerId && !state.bases.get(id)?.block
    );
    expect(secondAdj).toBeTruthy();

    const twoMatchBlock: AttributeBlock = {
      ...centerBlock,
      id: 'two-match-neighbor',
      thickness: centerBlock.thickness === 'thin' ? 'thick' : 'thin',
      size: centerBlock.size === 'small' ? 'large' : 'small',
    };
    expect(countMatchingAttributes(centerBlock, twoMatchBlock)).toHaveLength(2);

    const bases = new Map(state.bases);
    bases.set(secondAdj!, {
      ...bases.get(secondAdj!)!,
      block: twoMatchBlock,
      placedBy: 'player2',
    });
    const forged: Par55State = { ...state, bases };

    const probe: AttributeBlock = { ...centerBlock, id: 'probe-dual' };
    const { totalPoints, matchDetails } = calculateScore(
      forged,
      probe,
      targetId
    );
    expect(matchDetails.length).toBe(2);
    const pointSum = matchDetails.reduce((s, d) => s + d.points, 0);
    expect(totalPoints).toBe(pointSum);
    expect(totalPoints).toBe(6); // 4 from center + 2 from forged neighbor
  });

  it('forged neighbor with zero overlap contributes no detail entry', () => {
    const state = createInitialState();
    const centerId = createBaseId(2, 3);
    const centerBlock = state.bases.get(centerId)!.block!;
    const targetId = state.bases.get(centerId)!.adjacentBases[0];
    const target = state.bases.get(targetId)!;

    const zeroBlock: AttributeBlock = {
      id: 'zero-neighbor',
      shape: centerBlock.shape === 'circle' ? 'square' : 'circle',
      color: centerBlock.color === 'red' ? 'blue' : 'red',
      size: centerBlock.size === 'small' ? 'large' : 'small',
      thickness: centerBlock.thickness === 'thin' ? 'thick' : 'thin',
    };

    const bases = new Map(state.bases);
    bases.set(centerId, {
      ...bases.get(centerId)!,
      block: zeroBlock,
      placedBy: null,
    });

    // Isolate target so only zeroBlock is occupied neighbor
    for (const adjId of target.adjacentBases) {
      if (adjId !== centerId) {
        const nb = bases.get(adjId)!;
        bases.set(adjId, { ...nb, block: null, placedBy: null });
      }
    }

    const forged: Par55State = { ...state, bases };
    const probe: AttributeBlock = { ...centerBlock, id: 'probe-zero' };
    const result = calculateScore(forged, probe, targetId);
    expect(result.totalPoints).toBe(0);
    expect(result.matchDetails).toEqual([]);
  });

  it('points equal sum of matching attribute counts per neighbor', () => {
    const state = createInitialState();
    const centerId = createBaseId(2, 3);
    const centerBlock = state.bases.get(centerId)!.block!;
    const targetId = state.bases.get(centerId)!.adjacentBases[0];
    const probe: AttributeBlock = { ...centerBlock, id: 'attr-sum' };

    const { totalPoints, matchDetails } = calculateScore(state, probe, targetId);
    for (const detail of matchDetails) {
      expect(detail.points).toBe(detail.matchingAttributes.length);
    }
    expect(totalPoints).toBe(
      matchDetails.reduce((s, d) => s + d.matchingAttributes.length, 0)
    );
  });
});
