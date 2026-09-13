/**
 * Wave 18 — geometry / transform cycles & placement gates.
 * Distinct from wave 15 (wrong-phase identity), wave 16 (AI pipelines),
 * and wave 17 (success playthroughs). Tests-only. No product inventing.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import {
  createInitialState as createJuggle,
  doRollDice as juggleRoll,
  selectDie,
  selectShape,
  rotateShape,
  flipShape,
} from '../../src/games/juggle/rules';
import { TETROMINOES, PENTOMINOES } from '../../src/core/polyomino/types';

import { createInitialState as createPent } from '../../src/games/pent-em-in/types';
import {
  selectPiece,
  rotateSelectedPiece,
  flipSelectedPiece,
  canPlacePiece,
} from '../../src/games/pent-em-in/rules';

import {
  createInitialState as createHex,
  createEmptyBoard,
} from '../../src/games/hex/types';
import {
  isValidPosition,
  isCellEmpty,
  getWinningPath,
  checkWinner,
  makeMove as hexMake,
} from '../../src/games/hex/rules';

import { createInitialState as createHag } from '../../src/games/hex-a-gone/types';
import { canPlaceAt } from '../../src/games/hex-a-gone/rules';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 18 geometry — Juggle rotate/flip cycles', () => {
  it('rotateShape full 0→90→180→270→0 cycle while placing', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.15);
    let state = juggleRoll(createJuggle());
    // Force a rotatable tetromino into placing
    state = {
      ...state,
      phase: 'placing',
      selectedCategory: 'tetromino',
      selectedShape: TETROMINOES.find((s) => s.canRotate) ?? TETROMINOES[0],
      selectedRotation: 0,
      selectedFlipped: false,
    };
    expect(state.selectedShape).not.toBeNull();

    const seen: number[] = [state.selectedRotation];
    for (let i = 0; i < 4; i++) {
      state = rotateShape(state);
      seen.push(state.selectedRotation);
    }
    expect(seen).toEqual([0, 90, 180, 270, 0]);
  });

  it('flipShape is identity when selected shape cannot flip', () => {
    const noFlip = TETROMINOES.find((s) => !s.canFlip) ?? TETROMINOES[0];
    const state = {
      ...createJuggle(),
      phase: 'placing' as const,
      selectedCategory: 'tetromino' as const,
      selectedShape: noFlip,
      selectedRotation: 0 as const,
      selectedFlipped: false,
    };
    if (!noFlip.canFlip) {
      expect(flipShape(state)).toBe(state);
    } else {
      // All tetrominoes flippable — still assert toggle works
      expect(flipShape(state).selectedFlipped).toBe(true);
    }
  });

  it('flipShape toggles for a flippable pentomino in placing', () => {
    const flippable = PENTOMINOES.find((s) => s.canFlip);
    expect(flippable).toBeDefined();
    let state = {
      ...createJuggle(),
      phase: 'placing' as const,
      selectedCategory: 'pentomino' as const,
      selectedShape: flippable!,
      selectedRotation: 0 as const,
      selectedFlipped: false,
    };
    state = flipShape(state);
    expect(state.selectedFlipped).toBe(true);
    state = flipShape(state);
    expect(state.selectedFlipped).toBe(false);
  });

  it('die→shape path reaches placing before rotate is meaningful', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.22);
    let state = juggleRoll(createJuggle());
    expect(state.phase).toBe('selectingShape');
    state = selectDie(state, 0);
    if (state.phase === 'selectingShape') {
      const shape = TETROMINOES[0];
      state = selectShape(state, shape);
    }
    expect(state.phase).toBe('placing');
    const rotated = rotateShape(state);
    expect(rotated).not.toBe(state);
    expect([90, 180, 270, 0]).toContain(rotated.selectedRotation);
  });
});

describe('Wave 18 geometry — Pent-em-In transforms + OOB gate', () => {
  it('rotateSelectedPiece full cycle on rotatable I5', () => {
    let state = selectPiece(createPent(), 'I5');
    const rotations = [0];
    for (let i = 0; i < 4; i++) {
      state = rotateSelectedPiece(state);
      rotations.push(state.selectedRotation);
    }
    expect(rotations).toEqual([0, 90, 180, 270, 0]);
  });

  it('canPlacePiece false for out-of-bounds anchor', () => {
    const state = createPent();
    expect(canPlacePiece(state, 'I5', { row: -1, col: 0 }, 0, false)).toBe(
      false
    );
    expect(canPlacePiece(state, 'I5', { row: 0, col: 9 }, 0, false)).toBe(
      false
    );
    expect(canPlacePiece(state, 'I5', { row: 0, col: 0 }, 0, false)).toBe(true);
  });

  it('flipSelectedPiece no-ops for non-flippable; toggles for F', () => {
    const i5 = selectPiece(createPent(), 'I5');
    expect(flipSelectedPiece(i5)).toBe(i5);
    const f = selectPiece(createPent(), 'F');
    expect(flipSelectedPiece(f).selectedFlipped).toBe(true);
  });
});

describe('Wave 18 geometry — Hex path / emptiness gates', () => {
  it('isValidPosition / isCellEmpty bounds and occupancy', () => {
    const size = 5;
    expect(isValidPosition({ row: 0, col: 0 }, size)).toBe(true);
    expect(isValidPosition({ row: -1, col: 0 }, size)).toBe(false);
    expect(isValidPosition({ row: 5, col: 0 }, size)).toBe(false);

    const board = createEmptyBoard(size);
    expect(isCellEmpty(board, { row: 2, col: 2 })).toBe(true);
    board[2][2] = 'player1';
    expect(isCellEmpty(board, { row: 2, col: 2 })).toBe(false);
  });

  it('getWinningPath empty without bridge; nonempty after forced top-bottom', () => {
    const size = 3;
    const empty = createEmptyBoard(size);
    expect(getWinningPath(empty, 'player1', size)).toEqual([]);
    expect(checkWinner(empty, 'player1', size)).toBe(false);

    // Force player1 column bridge top→bottom on col 1
    const board = createEmptyBoard(size);
    for (let row = 0; row < size; row++) {
      board[row][1] = 'player1';
    }
    expect(checkWinner(board, 'player1', size)).toBe(true);
    const path = getWinningPath(board, 'player1', size);
    expect(path.length).toBeGreaterThanOrEqual(size);
    expect(path.some((p) => p.row === 0)).toBe(true);
    expect(path.some((p) => p.row === size - 1)).toBe(true);
  });

  it('makeMove occupies cell and flips seat on opening hex', () => {
    const opening = createHex(5);
    const after = hexMake(opening, { row: 2, col: 2 });
    expect(after.board[2][2]).toBe('player1');
    expect(after.currentPlayer).toBe('player2');
    expect(isCellEmpty(after.board, { row: 2, col: 2 })).toBe(false);
  });
});

describe('Wave 18 geometry — Hex-a-Gone canPlaceAt', () => {
  it('true for empty board cells; false for filled or missing coords', () => {
    const state = createHag();
    const cell = state.board.find((c) => !c.filled);
    expect(cell).toBeDefined();
    expect(canPlaceAt(state, cell!.q, cell!.r)).toBe(true);

    const filled = {
      ...state,
      board: state.board.map((c, i) =>
        i === 0 ? { ...c, filled: true, filledBy: 'player1' as const } : c
      ),
    };
    const first = filled.board[0];
    expect(canPlaceAt(filled, first.q, first.r)).toBe(false);
    expect(canPlaceAt(state, 999, 999)).toBe(false);
  });
});
