/**
 * Wave 43 — Hex-a-Gone multi-block turn remaining selection. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createInitialState } from '../../src/games/hex-a-gone/types';
import {
  selectBlock,
  commitSelection,
  placeBlock,
} from '../../src/games/hex-a-gone/rules';

describe('Wave 43 hex-a-gone — multi-block turn', () => {
  it('placing first of two keeps placeBlocks and advances selected block', () => {
    let s = selectBlock(createInitialState(), 'hexagon');
    s = selectBlock(s, 'triangle');
    s = commitSelection(s);
    expect(s.turnSelection.blocks).toEqual(['hexagon', 'triangle']);
    const mid = placeBlock(s, 0, 0);
    expect(mid.phase).toBe('placeBlocks');
    expect(mid.currentPlayer).toBe('player1');
    expect(mid.turnSelection.blocks).toEqual(['triangle']);
    expect(mid.selectedBlockForPlacement).toBe('triangle');
    const done = placeBlock(mid, 1, 0);
    expect(done.phase).toBe('selectBlocks');
    expect(done.currentPlayer).toBe('player2');
    expect(done.placedBlocks).toHaveLength(2);
  });
});
