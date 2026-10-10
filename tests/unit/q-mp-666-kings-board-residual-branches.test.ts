/**
 * q-mp-666 — Close `kings-quadraphages/board` residual branches (tests-only).
 *
 * Live tip re-measure (`cursor/mp-tip-post1059` @ `be822e75`): with related
 * `tests/unit/*kings*` suites under
 * `--coverage.include=src/games/kings-quadraphages/board.ts`,
 * **58.82%** stmts / **50.0%** branches / **63.63%** funcs / **57.57%** lines.
 * Uncovered under that glob: L44–52 (1↔0-based convert), L102–114 (`getPiece`
 * OOB / sparse-row / hole-cell), L121+125 (`isEmpty` OOB / sparse-row),
 * L137 (`hasSupply`), plus createInitialGameState sparse-start-row false arms
 * (L65/L74) that dedicated non-`*kings*` hosts also miss.
 *
 * HOLD-CHECK (Grok Bot): board helpers are rules-adjacent — pin CURRENT
 * geometry/state helper behavior only. No legal-move asserts, no scoring,
 * no AI move-choice/timing, no copy/aria/label/message-body text pins.
 * Zero `src/` edits. Leave `#1053`/`608` board-3d branch tests **contained**.
 *
 * Listed in `vitest.config.ts` `isolatedFiles` for `Array.from` spy on the
 * createInitialGameState sparse-row false-arm probe (must not leak into
 * isolate:false shared workers).
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  BOARD_SIZE,
  PLAYER1_KING_START,
  PLAYER2_KING_START,
  createInitialBoard,
  createInitialGameState,
  fromOneBasedPosition,
  getPiece,
  getSupply,
  hasSupply,
  isEmpty,
  isValidPosition,
  toOneBasedPosition,
  type Board,
} from '../../src/games/kings-quadraphages/board';
import { INITIAL_QUADRAPHAGE_COUNT } from '../../src/games/kings-quadraphages/pieces';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('q-mp-666 kings/board — position convert + validity residuals', () => {
  it('fromOneBased / toOneBased round-trip king start coords (L44–52)', () => {
    const zero = fromOneBasedPosition(1, 5);
    expect(zero).toEqual({ row: 0, col: 4 });
    expect(toOneBasedPosition(zero)).toEqual({ row: 1, col: 5 });
    expect(toOneBasedPosition(PLAYER1_KING_START)).toEqual({ row: 1, col: 5 });
    expect(toOneBasedPosition(PLAYER2_KING_START)).toEqual({ row: 9, col: 5 });
    expect(fromOneBasedPosition(9, 5)).toEqual(PLAYER2_KING_START);
  });

  it('isValidPosition covers in-bounds and each OOB edge', () => {
    expect(isValidPosition({ row: 0, col: 0 })).toBe(true);
    expect(isValidPosition({ row: BOARD_SIZE - 1, col: BOARD_SIZE - 1 })).toBe(
      true
    );
    expect(isValidPosition({ row: -1, col: 0 })).toBe(false);
    expect(isValidPosition({ row: 0, col: -1 })).toBe(false);
    expect(isValidPosition({ row: BOARD_SIZE, col: 0 })).toBe(false);
    expect(isValidPosition({ row: 0, col: BOARD_SIZE })).toBe(false);
  });
});

describe('q-mp-666 kings/board — getPiece / isEmpty sparse + OOB arms', () => {
  it('getPiece returns null for OOB, missing row, and hole cell (L102–114)', () => {
    const board = createInitialBoard();
    expect(getPiece(board, { row: -1, col: 0 })).toBeNull();
    expect(getPiece(board, { row: 0, col: BOARD_SIZE })).toBeNull();
    expect(getPiece(board, PLAYER1_KING_START)?.type).toBe('king');
    expect(getPiece(board, { row: 4, col: 4 })).toBeNull();

    const sparse = board.slice() as Board;
    delete sparse[4];
    expect(getPiece(sparse, { row: 4, col: 0 })).toBeNull();

    const shortRow = board.slice() as Board;
    shortRow[3] = [];
    expect(getPiece(shortRow, { row: 3, col: 0 })).toBeNull();
  });

  it('isEmpty false for OOB / missing row; true only for empty in-bounds (L121/125)', () => {
    const board = createInitialBoard();
    expect(isEmpty(board, { row: -1, col: 0 })).toBe(false);
    expect(isEmpty(board, { row: BOARD_SIZE, col: 0 })).toBe(false);
    expect(isEmpty(board, PLAYER1_KING_START)).toBe(false);
    expect(isEmpty(board, { row: 4, col: 4 })).toBe(true);

    const sparse = board.slice() as Board;
    delete sparse[2];
    expect(isEmpty(sparse, { row: 2, col: 0 })).toBe(false);
  });
});

describe('q-mp-666 kings/board — supply helpers', () => {
  it('getSupply / hasSupply mirror both seats including zero supply (L137)', () => {
    const state = createInitialGameState();
    expect(getSupply(state, 'player1')).toBe(INITIAL_QUADRAPHAGE_COUNT);
    expect(getSupply(state, 'player2')).toBe(INITIAL_QUADRAPHAGE_COUNT);
    expect(hasSupply(state, 'player1')).toBe(true);
    expect(hasSupply(state, 'player2')).toBe(true);

    const p1Empty = { ...state, player1Supply: 0 };
    expect(hasSupply(p1Empty, 'player1')).toBe(false);
    expect(hasSupply(p1Empty, 'player2')).toBe(true);

    const p2Empty = { ...state, player2Supply: 0 };
    expect(hasSupply(p2Empty, 'player2')).toBe(false);
    expect(getSupply(p2Empty, 'player2')).toBe(0);
  });
});

describe('q-mp-666 kings/board — createInitialGameState sparse start-row arms', () => {
  it('skips king placement when start rows are missing (L65/L74 false arms)', () => {
    // Defensive: createInitialGameState gates `board[start.row]` before write.
    // Dense Array.from never yields undefined rows; forge the outer board so
    // PLAYER1/PLAYER2 start rows are holes — current behavior leaves those
    // slots unset and still returns supplies.
    const realFrom = Array.from.bind(Array);
    const spy = vi.spyOn(Array, 'from').mockImplementation(((
      ...args: Parameters<typeof Array.from>
    ) => {
      const result = realFrom(...(args as [ArrayLike<unknown>]));
      // Outer board only: BOARD_SIZE rows, each an array (inner from already ran).
      if (
        Array.isArray(result) &&
        result.length === BOARD_SIZE &&
        Array.isArray(result[0])
      ) {
        const sparse = result.slice() as Board;
        delete sparse[PLAYER1_KING_START.row];
        delete sparse[PLAYER2_KING_START.row];
        return sparse;
      }
      return result;
    }) as typeof Array.from);

    try {
      const state = createInitialGameState();
      expect(state.board[PLAYER1_KING_START.row]).toBeUndefined();
      expect(state.board[PLAYER2_KING_START.row]).toBeUndefined();
      expect(state.player1Supply).toBe(INITIAL_QUADRAPHAGE_COUNT);
      expect(state.player2Supply).toBe(INITIAL_QUADRAPHAGE_COUNT);
      // Adjacent dense rows still exist — geometry helpers stay structural.
      expect(state.board[1]).toHaveLength(BOARD_SIZE);
      expect(getPiece(state.board, { row: 1, col: 0 })).toBeNull();
    } finally {
      spy.mockRestore();
    }
  });
});
