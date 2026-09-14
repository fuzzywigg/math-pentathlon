/**
 * Overnight TOKENMAXX — Hex-a-Gone placeBlock no selection leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import {
  selectBlock,
  commitSelection,
  placeBlock,
} from '../../src/games/hex-a-gone/rules';

describe('Overnight hexagone — place no selection', () => {
  it('placeBlocks with null selectedBlockForPlacement is identity', () => {
    let s = createInitialState();
    s = selectBlock(s, 'triangle');
    s = commitSelection(s);
    expect(s.phase).toBe('placeBlocks');
    // commit auto-selects first block; clear it to hit the guard
    s = { ...s, selectedBlockForPlacement: null };
    expect(placeBlock(s, 0, 0)).toBe(s);
  });
});
