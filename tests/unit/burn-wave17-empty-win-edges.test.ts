/**
 * Wave 17 — empty-board win/draw/path edges for existing games.
 * Companion to opponent-identity + board-bounds. Not wave 13 win-draw-AI playthroughs
 * and not wave 16 place→score. Tests-only; no product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  createEmptyBoard,
  createInitialState as createHex,
} from '../../src/games/hex/types';
import {
  checkWinner,
  getWinningPath,
  getValidMoves as hexValidMoves,
  makeMove as hexMakeMove,
} from '../../src/games/hex/rules';

import { createInitialGameState as createKings } from '../../src/games/kings-quadraphages/board';
import {
  isDrawCondition,
  getValidKingMoves,
  getValidQuadraphagePlacements,
} from '../../src/games/kings-quadraphages/rules';

import {
  createFiarBoard,
  createInitialState as createFiar,
  areConnected,
} from '../../src/games/fiar/types';
import { isPathBlocked, findPaths } from '../../src/games/fiar/rules';

import { createInitialState as createQueens } from '../../src/games/queens-guards/types';
import { getValidMoves as queensValidMoves } from '../../src/games/queens-guards/rules';

import { createInitialState as createHag } from '../../src/games/hex-a-gone/types';
import { canPlayerMove as hagCanMove } from '../../src/games/hex-a-gone/rules';

describe('Wave 17 empty-win-edges — Hex path / winner empty board', () => {
  it('checkWinner is false on empty board for both seats', () => {
    const board = createEmptyBoard(5);
    expect(checkWinner(board, 'player1', 5)).toBe(false);
    expect(checkWinner(board, 'player2', 5)).toBe(false);
  });

  it('getWinningPath is [] when no winning connection exists', () => {
    const board = createEmptyBoard(5);
    expect(getWinningPath(board, 'player1', 5)).toEqual([]);
    expect(getWinningPath(board, 'player2', 5)).toEqual([]);

    // Partial column — not a full top↔bottom bridge
    board[0][0] = 'player1';
    board[1][0] = 'player1';
    expect(checkWinner(board, 'player1', 5)).toBe(false);
    expect(getWinningPath(board, 'player1', 5)).toEqual([]);
  });

  it('opening state exposes a full empty-move set equal to board cells', () => {
    const state = createHex(3);
    const moves = hexValidMoves(state);
    expect(moves).toHaveLength(9);
    expect(state.winner).toBeNull();
  });

  it('after a completed top-bottom bridge, path is non-empty and length ≤ size', () => {
    let state = createHex(3);
    // Player1 connects top→bottom on col 0 (neighbors allow vertical chain)
    state = hexMakeMove(state, { row: 0, col: 0 }); // p1
    state = hexMakeMove(state, { row: 0, col: 1 }); // p2 distractor
    state = hexMakeMove(state, { row: 1, col: 0 }); // p1
    state = hexMakeMove(state, { row: 0, col: 2 }); // p2
    state = hexMakeMove(state, { row: 2, col: 0 }); // p1 completes
    expect(checkWinner(state.board, 'player1', 3)).toBe(true);
    const path = getWinningPath(state.board, 'player1', 3);
    expect(path.length).toBeGreaterThan(0);
    expect(path.length).toBeLessThanOrEqual(3);
    expect(path.some((p) => p.row === 0)).toBe(true);
    expect(path.some((p) => p.row === 2)).toBe(true);
  });
});

describe('Wave 17 empty-win-edges — Kings opening draw / move availability', () => {
  it('isDrawCondition is false on opening state', () => {
    const state = createKings();
    expect(isDrawCondition(state)).toBe(false);
  });

  it('both kings have opening moves; quadraphage placements are non-empty', () => {
    const state = createKings();
    expect(getValidKingMoves(state, 'player1').length).toBeGreaterThan(0);
    expect(getValidKingMoves(state, 'player2').length).toBeGreaterThan(0);
    expect(getValidQuadraphagePlacements(state).length).toBeGreaterThan(0);
  });
});

describe('Wave 17 empty-win-edges — FIAR empty graph edges', () => {
  it('areConnected is false for unknown node ids on fresh board', () => {
    const board = createFiarBoard();
    expect(areConnected(board, 'no-such-a', 'no-such-b')).toBe(false);
  });

  it('isPathBlocked on empty path list is false', () => {
    const state = createFiar();
    expect(isPathBlocked(state, [], 'player1')).toBe(false);
  });

  it('findPaths on opening state is an empty list (no chips yet)', () => {
    const state = createFiar();
    expect(findPaths(state, 'player1')).toEqual([]);
    expect(findPaths(state, 'player2')).toEqual([]);
  });
});

describe('Wave 17 empty-win-edges — Queens / Hex-a-Gone opening mobility', () => {
  it('Queens opening has selectable piece moves for current player', () => {
    const state = createQueens();
    let anyMoves = 0;
    for (const cell of state.cells.values()) {
      if (cell.piece?.player === state.currentPlayer) {
        anyMoves += queensValidMoves(state, {
          ring: cell.ring,
          position: cell.position,
        }).length;
      }
    }
    expect(anyMoves).toBeGreaterThan(0);
  });

  it('Hex-a-Gone opening canPlayerMove is true for both seats', () => {
    const state = createHag();
    expect(hagCanMove(state, 'player1')).toBe(true);
    expect(hagCanMove(state, 'player2')).toBe(true);
  });
});
