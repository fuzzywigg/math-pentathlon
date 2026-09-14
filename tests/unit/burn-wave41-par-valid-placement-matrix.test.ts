/**
 * Wave 41 — Par 55 isValidPlacement / getValidPlacements leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  isValidPlacement,
  getValidPlacements,
} from '../../src/games/par-55/rules';
import { createBaseId } from '../../src/games/par-55/types';

describe('Wave 41 par — valid placement matrix', () => {
  it('isValidPlacement false for missing base id', () => {
    const state = createInitialState();
    expect(isValidPlacement(state, 'base-99-99')).toBe(false);
    expect(isValidPlacement(state, 'not-a-base')).toBe(false);
  });

  it('isValidPlacement false for occupied center seed', () => {
    const state = createInitialState();
    const centerId = createBaseId(2, 3); // BOARD_ROWS/2, BOARD_COLS/2
    expect(state.bases.get(centerId)?.block).toBeTruthy();
    expect(isValidPlacement(state, centerId)).toBe(false);
  });

  it('isValidPlacement false when no adjacent occupied base', () => {
    const state = createInitialState();
    // Far corner typically not adjacent to center seed on this board
    const corner = createBaseId(0, 0);
    const cornerBase = state.bases.get(corner)!;
    const touchesSeed = cornerBase.adjacentBases.some(
      (id) => state.bases.get(id)?.block
    );
    if (!touchesSeed) {
      expect(isValidPlacement(state, corner)).toBe(false);
    } else {
      // If layout does touch, just assert adjacency contract via a forged empty isolated base
      const bases = new Map(state.bases);
      bases.set(corner, { ...cornerBase, adjacentBases: [], block: null });
      expect(isValidPlacement({ ...state, bases }, corner)).toBe(false);
    }
  });

  it('getValidPlacements returns only empty adjacent-to-occupied bases', () => {
    const state = createInitialState();
    const valids = getValidPlacements(state);
    expect(valids.length).toBeGreaterThan(0);
    for (const id of valids) {
      expect(isValidPlacement(state, id)).toBe(true);
      expect(state.bases.get(id)?.block).toBeNull();
    }
    // Occupied center never listed
    const occupied = [...state.bases.values()].find((b) => b.block);
    expect(occupied).toBeTruthy();
    expect(valids).not.toContain(occupied!.id);
  });
});
