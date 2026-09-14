/**
 * Wave 41 — Juggle preview empty + placement phase/invalid reject leftovers. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectDie,
  selectShape,
  getPreviewCells,
  isPlacementValid,
  placeShape,
} from '../../src/games/juggle/rules';
import { getShapesForDie } from '../../src/games/juggle/types';
import { TETROMINOES } from '../../src/core/polyomino/types';
import { createBoard } from '../../src/core/polyomino/placement';

describe('Wave 41 Juggle — getPreviewCells empty', () => {
  it('returns [] when selectedShape is null', () => {
    const state = createInitialState();
    expect(getPreviewCells(state, { row: 0, col: 0 })).toEqual([]);
    const selecting = {
      ...state,
      phase: 'selectingShape' as const,
      currentDice: [4, 4] as [number, number],
      selectedCategory: 'tetromino' as const,
      selectedShape: null,
    };
    expect(getPreviewCells(selecting, { row: 3, col: 3 })).toEqual([]);
  });

  it('returns non-empty cells once a monomino is selected', () => {
    let state = {
      ...createInitialState(),
      currentDice: [1, 1] as [number, number],
      phase: 'selectingShape' as const,
    };
    state = selectDie(state, 0);
    const cells = getPreviewCells(state, { row: 2, col: 4 });
    expect(cells).toHaveLength(1);
    expect(cells[0]).toEqual({ row: 2, col: 4 });
  });
});

describe('Wave 41 Juggle — isPlacementValid wrong phase', () => {
  it('false when phase is not placing even with a shape', () => {
    const shape = getShapesForDie(1)[0];
    const state = {
      ...createInitialState(),
      phase: 'selectingShape' as const,
      currentDice: [1, 2] as [number, number],
      selectedCategory: 'monomino' as const,
      selectedShape: shape,
    };
    expect(isPlacementValid(state, { row: 0, col: 0 })).toBe(false);
  });

  it('false when selectedShape is null in placing', () => {
    const state = {
      ...createInitialState(),
      phase: 'placing' as const,
      selectedShape: null,
    };
    expect(isPlacementValid(state, { row: 0, col: 0 })).toBe(false);
  });

  it('true for monomino on empty opening board in placing', () => {
    let state = {
      ...createInitialState(),
      currentDice: [1, 3] as [number, number],
      phase: 'selectingShape' as const,
    };
    state = selectDie(state, 0);
    expect(state.phase).toBe('placing');
    expect(isPlacementValid(state, { row: 4, col: 4 })).toBe(true);
  });
});

describe('Wave 41 Juggle — placeShape invalid reject', () => {
  it('identity when phase is not placing', () => {
    const state = {
      ...createInitialState(),
      phase: 'selectingShape' as const,
      currentDice: [1, 1] as [number, number],
      selectedShape: getShapesForDie(1)[0],
    };
    expect(placeShape(state, { row: 0, col: 0 })).toBe(state);
  });

  it('identity when currentDice is null', () => {
    const state = {
      ...createInitialState(),
      phase: 'placing' as const,
      currentDice: null,
      selectedShape: getShapesForDie(1)[0],
    };
    expect(placeShape(state, { row: 0, col: 0 })).toBe(state);
  });

  it('identity on occupied cell after prior fill', () => {
    let state = {
      ...createInitialState(),
      currentDice: [1, 1] as [number, number],
      phase: 'selectingShape' as const,
    };
    state = selectDie(state, 0);
    state = placeShape(state, { row: 0, col: 0 });
    state = {
      ...state,
      currentDice: [1, 1] as [number, number],
      phase: 'selectingShape',
    };
    state = selectDie(state, 0);
    state = placeShape(state, { row: 0, col: 0 });
    state = {
      ...state,
      currentDice: [1, 1] as [number, number],
      phase: 'selectingShape',
    };
    state = selectDie(state, 0);
    expect(state.boards.player1.cells[0][0]).toBe(true);
    const before = state;
    expect(placeShape(state, { row: 0, col: 0 })).toBe(before);
    expect(isPlacementValid(state, { row: 0, col: 0 })).toBe(false);
  });

  it('identity when tetromino would hang off the board edge', () => {
    let state = {
      ...createInitialState(),
      currentDice: [4, 4] as [number, number],
      phase: 'selectingShape' as const,
    };
    state = selectDie(state, 0);
    if (state.phase === 'selectingShape') {
      state = selectShape(state, TETROMINOES[0]);
    }
    expect(state.phase).toBe('placing');
    const before = state;
    const rejected = placeShape(state, { row: 8, col: 8 });
    expect(rejected).toBe(before);
  });

  it('does not mutate opponent board on valid place', () => {
    let state = {
      ...createInitialState(),
      currentDice: [1, 1] as [number, number],
      phase: 'selectingShape' as const,
    };
    const emptyP2 = createBoard(9, 9);
    state = selectDie(state, 0);
    state = placeShape(state, { row: 1, col: 1 });
    expect(state.boards.player1.cells[1][1]).toBe(true);
    expect(state.boards.player2.cells).toEqual(emptyP2.cells);
    expect(state.currentPlayer).toBe('player2');
    expect(state.phase).toBe('rolling');
  });
});
