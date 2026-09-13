/**
 * Wave 17 — board bounds / empty-structure geometry for existing games.
 * Distinct from wave 14 types-helpers (adjacency/keys/shuffles) and waves 15–16
 * (rules-phase, AI, place→score). Tests-only; no product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  createEmptyBoard,
  createInitialState as createHex,
  DEFAULT_BOARD_SIZE,
} from '../../src/games/hex/types';
import {
  isValidPosition as hexValidPos,
  isCellEmpty,
  isValidMove as hexValidMove,
  getNeighbors,
} from '../../src/games/hex/rules';

import {
  createInitialState as createHag,
  getCellAt,
  isValidPosition as hagValidPos,
} from '../../src/games/hex-a-gone/types';

import {
  createBoard as createQueensBoard,
  cellKey,
  cellsInRing,
  CONFIG as QG_CONFIG,
  createInitialState as createQueens,
} from '../../src/games/queens-guards/types';

import {
  BOARD_SIZE as KINGS_SIZE,
  createInitialBoard,
  createInitialGameState as createKings,
  fromOneBasedPosition,
  toOneBasedPosition,
  isValidPosition as kingsValidPos,
  getPiece,
  isEmpty,
  PLAYER1_KING_START,
  PLAYER2_KING_START,
  getSupply,
  hasSupply,
} from '../../src/games/kings-quadraphages/board';

import {
  createBoard as createContigBoard,
  CONFIG as CONTIG_CFG,
  createInitialState as createContig,
} from '../../src/games/contig-60/types';

describe('Wave 17 board-bounds — Hex empty board + position guards', () => {
  it('createEmptyBoard(default) is 11×11 of null', () => {
    const board = createEmptyBoard();
    expect(board).toHaveLength(DEFAULT_BOARD_SIZE);
    expect(DEFAULT_BOARD_SIZE).toBe(11);
    for (const row of board) {
      expect(row).toHaveLength(DEFAULT_BOARD_SIZE);
      expect(row.every((c) => c === null)).toBe(true);
    }
  });

  it('createEmptyBoard(n) is n×n of null for small n', () => {
    const board = createEmptyBoard(3);
    expect(board).toHaveLength(3);
    expect(board.every((row) => row.length === 3 && row.every((c) => c === null))).toBe(
      true
    );
  });

  it('isValidPosition rejects negatives and size boundary', () => {
    expect(hexValidPos({ row: 0, col: 0 }, 5)).toBe(true);
    expect(hexValidPos({ row: 4, col: 4 }, 5)).toBe(true);
    expect(hexValidPos({ row: -1, col: 0 }, 5)).toBe(false);
    expect(hexValidPos({ row: 0, col: -1 }, 5)).toBe(false);
    expect(hexValidPos({ row: 5, col: 0 }, 5)).toBe(false);
    expect(hexValidPos({ row: 0, col: 5 }, 5)).toBe(false);
  });

  it('isCellEmpty is true on fresh board; false after occupancy', () => {
    const board = createEmptyBoard(3);
    expect(isCellEmpty(board, { row: 1, col: 1 })).toBe(true);
    board[1][1] = 'player1';
    expect(isCellEmpty(board, { row: 1, col: 1 })).toBe(false);
  });

  it('isValidMove is false when winner is set or cell occupied', () => {
    const state = createHex(3);
    expect(hexValidMove(state, { row: 0, col: 0 })).toBe(true);
    state.board[0][0] = 'player1';
    expect(hexValidMove(state, { row: 0, col: 0 })).toBe(false);
    state.board[0][1] = null;
    state.winner = 'player2';
    expect(hexValidMove(state, { row: 0, col: 1 })).toBe(false);
    expect(hexValidMove(state, { row: -1, col: 0 })).toBe(false);
  });

  it('corner cells have fewer than 6 neighbors', () => {
    const size = 5;
    const corner = getNeighbors({ row: 0, col: 0 }, size);
    expect(corner.length).toBeLessThan(6);
    expect(corner.length).toBeGreaterThan(0);
    for (const n of corner) {
      expect(hexValidPos(n, size)).toBe(true);
    }
    const center = getNeighbors({ row: 2, col: 2 }, size);
    expect(center).toHaveLength(6);
  });
});

describe('Wave 17 board-bounds — Hex-a-Gone getCellAt / isValidPosition', () => {
  it('center (0,0) exists; far axial miss is undefined / invalid', () => {
    const state = createHag();
    const center = getCellAt(state, 0, 0);
    expect(center).toBeDefined();
    expect(center!.filled).toBe(false);
    expect(hagValidPos(state, 0, 0)).toBe(true);

    expect(getCellAt(state, 99, 99)).toBeUndefined();
    expect(hagValidPos(state, 99, 99)).toBe(false);
    expect(hagValidPos(state, -99, 0)).toBe(false);
  });

  it('hex radius-3 board has 37 cells and all listed cells are valid', () => {
    const state = createHag();
    // 3*r*(r+1)+1 for r=3 → 37
    expect(state.board).toHaveLength(37);
    for (const cell of state.board) {
      expect(hagValidPos(state, cell.q, cell.r)).toBe(true);
      expect(getCellAt(state, cell.q, cell.r)).toEqual(cell);
    }
  });

  it('boardWidth/Height diameter matches radius-3 layout', () => {
    const state = createHag();
    expect(state.boardWidth).toBe(7);
    expect(state.boardHeight).toBe(7);
  });
});

describe('Wave 17 board-bounds — Queens createBoard geometry', () => {
  it('createBoard cell count equals sum of cellsInRing over rings', () => {
    const board = createQueensBoard();
    let expected = 0;
    for (let ring = 0; ring < QG_CONFIG.NUM_RINGS; ring++) {
      expected += cellsInRing(ring);
    }
    expect(board.size).toBe(expected);
    expect(QG_CONFIG.NUM_RINGS).toBe(6);
    expect(cellsInRing(0)).toBe(1);
    expect(cellsInRing(5)).toBe(30);
  });

  it('outer-ring queens sit at positions 7 and 22', () => {
    const board = createQueensBoard();
    const outer = QG_CONFIG.NUM_RINGS - 1;
    const p1 = board.get(cellKey(outer, 7));
    const p2 = board.get(cellKey(outer, 22));
    expect(p1?.piece?.type).toBe('queen');
    expect(p1?.piece?.player).toBe('player1');
    expect(p2?.piece?.type).toBe('queen');
    expect(p2?.piece?.player).toBe('player2');
  });

  it('center throne starts empty; initial state uses same board shape', () => {
    const board = createQueensBoard();
    expect(board.get(cellKey(0, 0))?.piece).toBeNull();
    const state = createQueens();
    expect(state.cells.size).toBe(board.size);
    expect(state.winner).toBeNull();
    expect(state.selectedPiece).toBeNull();
  });
});

describe('Wave 17 board-bounds — Kings position/supply geometry', () => {
  it('BOARD_SIZE is 9; from/to one-based round-trip', () => {
    expect(KINGS_SIZE).toBe(9);
    const zero = fromOneBasedPosition(1, 5);
    expect(zero).toEqual({ row: 0, col: 4 });
    expect(toOneBasedPosition(zero)).toEqual({ row: 1, col: 5 });
    expect(toOneBasedPosition(PLAYER1_KING_START)).toEqual({ row: 1, col: 5 });
    expect(toOneBasedPosition(PLAYER2_KING_START)).toEqual({ row: 9, col: 5 });
  });

  it('isValidPosition rejects out-of-bounds; getPiece miss is null', () => {
    const board = createInitialBoard();
    expect(kingsValidPos({ row: 0, col: 0 })).toBe(true);
    expect(kingsValidPos({ row: 8, col: 8 })).toBe(true);
    expect(kingsValidPos({ row: -1, col: 0 })).toBe(false);
    expect(kingsValidPos({ row: 0, col: 9 })).toBe(false);
    expect(getPiece(board, { row: -1, col: 0 })).toBeNull();
    expect(getPiece(board, { row: 0, col: 9 })).toBeNull();
  });

  it('opening board: kings occupy starts; center empty; supplies full', () => {
    const state = createKings();
    expect(getPiece(state.board, PLAYER1_KING_START)).toEqual({
      type: 'king',
      owner: 'player1',
    });
    expect(getPiece(state.board, PLAYER2_KING_START)).toEqual({
      type: 'king',
      owner: 'player2',
    });
    expect(isEmpty(state.board, { row: 4, col: 4 })).toBe(true);
    expect(isEmpty(state.board, PLAYER1_KING_START)).toBe(false);
    expect(isEmpty(state.board, { row: -1, col: 0 })).toBe(false);
    expect(getSupply(state, 'player1')).toBeGreaterThan(0);
    expect(getSupply(state, 'player2')).toBeGreaterThan(0);
    expect(hasSupply(state, 'player1')).toBe(true);
    expect(hasSupply(state, 'player2')).toBe(true);
  });
});

describe('Wave 17 board-bounds — Contig createBoard uniqueness', () => {
  it('default createBoard maps unique values for every grid cell', () => {
    const { cells, grid } = createContigBoard();
    expect(grid).toHaveLength(CONTIG_CFG.GRID_ROWS);
    expect(grid[0]).toHaveLength(CONTIG_CFG.GRID_COLS);
    expect(cells.size).toBe(CONTIG_CFG.GRID_ROWS * CONTIG_CFG.GRID_COLS);

    const seen = new Set<number>();
    for (let row = 0; row < CONTIG_CFG.GRID_ROWS; row++) {
      for (let col = 0; col < CONTIG_CFG.GRID_COLS; col++) {
        const value = grid[row][col];
        expect(value).not.toBeNull();
        expect(seen.has(value!)).toBe(false);
        seen.add(value!);
        const cell = cells.get(value!);
        expect(cell).toEqual({
          value,
          owner: null,
          row,
          col,
        });
      }
    }
  });

  it('duplicate boardNumbers throws', () => {
    const dup = Array.from({ length: CONTIG_CFG.GRID_ROWS }, (_, row) =>
      Array.from({ length: CONTIG_CFG.GRID_COLS }, (_, col) =>
        row === 0 && col === 1 ? 1 : row * CONTIG_CFG.GRID_COLS + col + 1
      )
    );
    // Force two cells to share value 1
    dup[0][0] = 1;
    dup[0][1] = 1;
    expect(() => createContigBoard(dup)).toThrow(/Duplicate board number/);
  });

  it('createInitialState embeds a full empty-owner board', () => {
    const state = createContig();
    expect(state.cells.size).toBe(CONTIG_CFG.GRID_ROWS * CONTIG_CFG.GRID_COLS);
    for (const cell of state.cells.values()) {
      expect(cell.owner).toBeNull();
    }
    expect(state.winner).toBeNull();
    expect(state.phase).toBe('rolling');
  });
});
