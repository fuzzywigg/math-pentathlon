/**
 * Wave 42 leftovers D — Hex-a-Gone midturn autoselect. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import {
  selectBlock,
  commitSelection,
  placeBlock,
} from '../../src/games/hex-a-gone/rules';

describe('Wave 42 D hexagone — midturn autoselect remaining', () => {
  it('after placing first of two, auto-selects remaining block', () => {
    let state = createInitialState();
    state = selectBlock(state, 'hexagon');
    state = selectBlock(state, 'triangle');
    state = commitSelection(state);
    expect(state.selectedBlockForPlacement).toBe('hexagon');

    const empty = state.board.find((c) => !c.filled)!;
    state = placeBlock(state, empty.q, empty.r);

    expect(state.phase).toBe('placeBlocks');
    expect(state.currentPlayer).toBe('player1');
    expect(state.turnSelection.blocks).toEqual(['triangle']);
    expect(state.selectedBlockForPlacement).toBe('triangle');
  });
});
