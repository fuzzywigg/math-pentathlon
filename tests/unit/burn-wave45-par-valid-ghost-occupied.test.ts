/**
 * Wave 45 — Par 55 isValidPlacement ghost/occupied/isolated leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, isValidPlacement } from '../../src/games/par-55/rules';
import { createBaseId } from '../../src/games/par-55/types';

describe('Wave 45 par — placement validity fences', () => {
  it('rejects ghost id and occupied center seed', () => {
    const state = createInitialState();
    expect(isValidPlacement(state, 'base-99-99')).toBe(false);
    const center = createBaseId(2, 3);
    expect(state.bases.get(center)?.block).not.toBeNull();
    expect(isValidPlacement(state, center)).toBe(false);
  });

  it('rejects isolated empty base with no adjacent block', () => {
    const state = createInitialState();
    // corner of board is usually not adjacent to center seed on 5x7 stagger
    const corner = createBaseId(0, 0);
    const base = state.bases.get(corner);
    expect(base).toBeDefined();
    if (base && !base.adjacentBases.some((id) => state.bases.get(id)?.block)) {
      expect(isValidPlacement(state, corner)).toBe(false);
    } else {
      // still assert at least one empty non-adjacent exists
      const invalid = [...state.bases.values()].find(
        (b) => !b.block && !b.adjacentBases.some((id) => state.bases.get(id)?.block)
      );
      expect(invalid).toBeDefined();
      expect(isValidPlacement(state, invalid!.id)).toBe(false);
    }
  });
});
