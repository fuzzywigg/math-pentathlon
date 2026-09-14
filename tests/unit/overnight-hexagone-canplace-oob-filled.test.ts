/**
 * Overnight TOKENMAXX — Hex-a-Gone canPlaceAt OOB/filled leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import {
  selectBlock,
  commitSelection,
  selectBlockForPlacement,
  canPlaceAt,
  placeBlock,
} from '../../src/games/hex-a-gone/rules';

describe('Overnight hexagone — canPlaceAt', () => {
  it('OOB false; filled reject', () => {
    let s = createInitialState();
    s = selectBlock(s, 'triangle');
    s = commitSelection(s);
    s = selectBlockForPlacement(s, 'triangle');
    expect(canPlaceAt(s, 99, 99)).toBe(false);
    const placed = placeBlock(s, 0, 0);
    expect(placed).not.toBe(s);
    // try place again on filled with new selection if still placeBlocks
    if (placed.phase === 'placeBlocks' && placed.turnSelection.blocks.length) {
      const again = selectBlockForPlacement(placed, placed.turnSelection.blocks[0]);
      expect(placeBlock(again, 0, 0)).toBe(again);
    }
  });
});
