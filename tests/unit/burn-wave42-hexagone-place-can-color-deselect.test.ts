/**
 * Wave 42 leftovers D — Hex-a-Gone canPlaceAt / place identity / colors / deselect. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  BLOCK_COLORS,
  type BlockShape,
} from '../../src/games/hex-a-gone/types';
import {
  selectBlock,
  commitSelection,
  canPlaceAt,
  placeBlock,
  getBlockColor,
  deselectBlock,
  selectBlockForPlacement,
} from '../../src/games/hex-a-gone/rules';

describe('Wave 42 D hexagone — canPlaceAt filled/OOB', () => {
  it('false on filled or missing cells; true on empty', () => {
    const state = createInitialState();
    expect(canPlaceAt(state, 0, 0)).toBe(true);
    expect(canPlaceAt(state, 9, 9)).toBe(false);
    state.board[0].filled = true;
    expect(canPlaceAt(state, state.board[0].q, state.board[0].r)).toBe(false);
  });
});

describe('Wave 42 D hexagone — placeBlock identity rejects', () => {
  it('identity when wrong phase, no selection, or filled target', () => {
    const opening = createInitialState();
    expect(placeBlock(opening, 0, 0)).toBe(opening);

    let state = createInitialState();
    state = selectBlock(state, 'triangle');
    state = commitSelection(state);
    const filled = {
      ...state,
      board: state.board.map((c) =>
        c.q === 0 && c.r === 0
          ? { ...c, filled: true, filledBy: 'player2' as const, blockId: 1 }
          : c
      ),
    };
    expect(placeBlock(filled, 0, 0)).toBe(filled);

    const noSel = { ...state, selectedBlockForPlacement: null };
    expect(placeBlock(noSel, 0, 0)).toBe(noSel);
  });
});

describe('Wave 42 D hexagone — getBlockColor + deselect preview', () => {
  it('getBlockColor matches BLOCK_COLORS', () => {
    const shapes = Object.keys(BLOCK_COLORS) as BlockShape[];
    for (const shape of shapes) {
      expect(getBlockColor(shape)).toBe(BLOCK_COLORS[shape]);
    }
  });

  it('deselect clears matching placement preview', () => {
    let state = createInitialState();
    state = selectBlock(state, 'hexagon');
    state = selectBlock(state, 'triangle');
    // Force a preview while still in selectBlocks (deselect path)
    state = { ...state, selectedBlockForPlacement: 'hexagon' };
    state = deselectBlock(state, 'hexagon');
    expect(state.turnSelection.blocks).toEqual(['triangle']);
    expect(state.selectedBlockForPlacement).toBeNull();
  });

  it('selectBlockForPlacement after commit is used by place path', () => {
    let state = createInitialState();
    state = selectBlock(state, 'rhombus');
    state = selectBlock(state, 'square');
    state = commitSelection(state);
    state = selectBlockForPlacement(state, 'square');
    expect(state.selectedBlockForPlacement).toBe('square');
  });
});
