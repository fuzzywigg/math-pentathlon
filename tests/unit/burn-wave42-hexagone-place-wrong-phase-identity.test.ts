/**
 * Wave 42 leftovers D — Hex-a-Gone place wrong phase identity. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import {
  selectBlock,
  commitSelection,
  placeBlock,
} from '../../src/games/hex-a-gone/rules';

describe('Wave 42 hexagone — placeBlock identity rejects', () => {
  it('identity when selectBlocks phase', () => {
    const state = createInitialState();
    expect(state.phase).toBe('selectBlocks');
    expect(placeBlock(state, 0, 0)).toBe(state);
  });

  it('identity when no selectedBlockForPlacement', () => {
    let state = createInitialState();
    state = selectBlock(state, 'triangle');
    state = commitSelection(state);
    const cleared = { ...state, selectedBlockForPlacement: null };
    expect(placeBlock(cleared, 0, 0)).toBe(cleared);
  });

  it('identity when target cell filled', () => {
    let state = createInitialState();
    state = selectBlock(state, 'square');
    state = commitSelection(state);
    const cell = state.board.find((c) => c.q === 0 && c.r === 0)!;
    cell.filled = true;
    expect(placeBlock(state, 0, 0)).toBe(state);
  });
});
