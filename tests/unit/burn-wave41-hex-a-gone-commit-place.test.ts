/**
 * Wave 41 — Hex-a-Gone commit / place / canPlaceAt leftovers. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  type BlockShape,
} from '../../src/games/hex-a-gone/types';
import {
  selectBlock,
  commitSelection,
  selectBlockForPlacement,
  canPlaceAt,
  placeBlock,
  getValidPlacements,
} from '../../src/games/hex-a-gone/rules';

describe('Wave 41 hex-a-gone — commit / placement rejects / multi-block turn', () => {
  it('commitSelection rejects empty selection; accepts and enters placeBlocks', () => {
    const empty = createInitialState();
    expect(commitSelection(empty)).toBe(empty);

    let state = selectBlock(empty, 'rhombus');
    state = commitSelection(state);
    expect(state.phase).toBe('placeBlocks');
    expect(state.turnSelection.committed).toBe(true);
    expect(state.selectedBlockForPlacement).toBe('rhombus');
  });

  it('selectBlockForPlacement rejects wrong phase and shapes not in selection', () => {
    const open = createInitialState();
    expect(selectBlockForPlacement(open, 'triangle')).toBe(open);

    let state = selectBlock(open, 'hexagon');
    state = selectBlock(state, 'triangle');
    state = commitSelection(state);
    expect(selectBlockForPlacement(state, 'square')).toBe(state);

    state = selectBlockForPlacement(state, 'triangle');
    expect(state.selectedBlockForPlacement).toBe('triangle');
  });

  it('canPlaceAt false for filled cells; true for empty on-board cells', () => {
    const state = createInitialState();
    const cell = state.board[0];
    expect(canPlaceAt(state, cell.q, cell.r)).toBe(true);
    cell.filled = true;
    expect(canPlaceAt(state, cell.q, cell.r)).toBe(false);
    expect(canPlaceAt(state, 99, 99)).toBe(false);
  });

  it('placeBlock multi-block turn completes and flips seat', () => {
    let state = createInitialState();
    state = selectBlock(state, 'triangle');
    state = selectBlock(state, 'square');
    state = commitSelection(state);

    const first = getValidPlacements(state)[0];
    expect(first).toBeTruthy();
    state = placeBlock(state, first.q, first.r);
    expect(state.phase).toBe('placeBlocks');
    expect(state.turnSelection.blocks).toHaveLength(1);
    expect(state.currentPlayer).toBe('player1');
    expect(state.bank.triangle === 11 || state.bank.square === 5).toBe(true);

    const second = getValidPlacements(state)[0];
    state = placeBlock(state, second.q, second.r);
    expect(state.phase).toBe('selectBlocks');
    expect(state.currentPlayer).toBe('player2');
    expect(state.turnSelection.blocks).toEqual([]);
    expect(state.selectedBlockForPlacement).toBeNull();
    expect(state.moveHistory).toHaveLength(1);
    // Engine records turnSelection.blocks at final place (remaining includes last piece only)
    expect(state.moveHistory[0].blocksPlaced).toEqual(['square']);
    expect(state.placedBlocks.map((b) => b.shape)).toEqual(
      expect.arrayContaining(['triangle', 'square'] as BlockShape[])
    );
  });

  it('placeBlock identity when cell already filled', () => {
    let state = createInitialState();
    state = selectBlock(state, 'hexagon');
    state = commitSelection(state);
    const spot = getValidPlacements(state)[0];
    state = placeBlock(state, spot.q, spot.r);
    // After single-block turn, phase flips — re-enter place with filled board cell
    let again = createInitialState();
    again = selectBlock(again, 'triangle');
    again = commitSelection(again);
    const cell = again.board.find((c) => c.q === spot.q && c.r === spot.r)!;
    cell.filled = true;
    expect(canPlaceAt(again, spot.q, spot.r)).toBe(false);
    expect(placeBlock(again, spot.q, spot.r)).toBe(again);
  });
});
