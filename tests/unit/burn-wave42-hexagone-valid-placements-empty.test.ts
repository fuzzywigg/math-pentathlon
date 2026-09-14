/**
 * Wave 42 leftovers D — Hex-a-Gone valid placements. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import {
  selectBlock,
  commitSelection,
  getValidPlacements,
} from '../../src/games/hex-a-gone/rules';

describe('Wave 42 D hexagone — getValidPlacements', () => {
  it('empty without selectedBlockForPlacement', () => {
    expect(getValidPlacements(createInitialState())).toEqual([]);
  });

  it('after commit equals all empty cells', () => {
    let state = createInitialState();
    state = selectBlock(state, 'square');
    state = commitSelection(state);
    const valids = getValidPlacements(state);
    expect(valids).toHaveLength(37);
    expect(valids).toContainEqual({ q: 0, r: 0 });
  });
});
