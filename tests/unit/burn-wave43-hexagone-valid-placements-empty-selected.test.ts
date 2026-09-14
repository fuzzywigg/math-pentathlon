/**
 * Wave 43 — Hex-a-Gone getValidPlacements without selection. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createInitialState } from '../../src/games/hex-a-gone/types';
import { getValidPlacements, commitSelection, selectBlock } from '../../src/games/hex-a-gone/rules';

describe('Wave 43 hex-a-gone — valid placements empty selected', () => {
  it('empty without selectedBlockForPlacement; nonempty after commit', () => {
    expect(getValidPlacements(createInitialState())).toEqual([]);
    const place = commitSelection(selectBlock(createInitialState(), 'triangle'));
    expect(getValidPlacements(place).length).toBe(37);
  });
});
