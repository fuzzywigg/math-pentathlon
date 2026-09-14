/**
 * Wave 42 — Par 55 forged seed first placement leftovers after #186. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  selectBlock,
  placeBlock,
  isValidPlacement,
  getValidPlacements,
  calculateScore,
} from '../../src/games/par-55/rules';
import { createBaseId, type Par55State } from '../../src/games/par-55/types';

function barrenWithSeed(
  state: Par55State,
  seedRow: number,
  seedCol: number
): Par55State {
  const bases = new Map(state.bases);
  for (const [id, base] of bases) {
    bases.set(id, { ...base, block: null, placedBy: null });
  }
  const seedId = createBaseId(seedRow, seedCol);
  const seedBlock = state.hands.player1[0];
  bases.set(seedId, {
    ...bases.get(seedId)!,
    block: { ...seedBlock, id: 'seed-block' },
    placedBy: null,
  });
  return { ...state, bases, selectedBlock: null, phase: 'selectingBlock' };
}

describe('Wave 42 par — forged seed first placement', () => {
  it('adjacent empty base becomes valid after single seed forge', () => {
    const state = barrenWithSeed(createInitialState(), 2, 3);
    const seedId = createBaseId(2, 3);
    const adjId = state.bases.get(seedId)!.adjacentBases[0];
    expect(isValidPlacement(state, adjId)).toBe(true);
    expect(isValidPlacement(state, seedId)).toBe(false);
  });

  it('first placement on forged board scores against seed neighbor', () => {
    let state = barrenWithSeed(createInitialState(), 2, 3);
    const block = state.hands.player1[0];
    state = selectBlock(state, block.id);
    const baseId = getValidPlacements(state)[0];
    const preview = calculateScore(state, block, baseId);
    const next = placeBlock(state, baseId);
    expect(next.scores.player1).toBe(preview.totalPoints);
    expect(next.moveHistory).toHaveLength(1);
    expect(next.bases.get(baseId)?.placedBy).toBe('player1');
  });

  it('non-adjacent bases remain invalid on forged barren board', () => {
    const state = barrenWithSeed(createInitialState(), 2, 3);
    const seedId = createBaseId(2, 3);
    const seedAdj = new Set(state.bases.get(seedId)!.adjacentBases);
    for (const base of state.bases.values()) {
      if (!base.block && !seedAdj.has(base.id)) {
        const touchesOccupied = base.adjacentBases.some(
          (id) => state.bases.get(id)?.block
        );
        expect(touchesOccupied).toBe(false);
        expect(isValidPlacement(state, base.id)).toBe(false);
      }
    }
  });

  it('getValidPlacements on forged seed lists only empty neighbors', () => {
    const state = barrenWithSeed(createInitialState(), 2, 3);
    const valids = getValidPlacements(state);
    expect(valids.length).toBeGreaterThan(0);
    for (const id of valids) {
      expect(state.bases.get(id)?.block).toBeNull();
      expect(isValidPlacement(state, id)).toBe(true);
    }
  });
});
