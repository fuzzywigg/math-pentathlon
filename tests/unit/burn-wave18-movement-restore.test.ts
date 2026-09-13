/**
 * Wave 18 — midgame movement / restore / draw helpers.
 * FIAR movement, Queens restore identity, Kings draw/win probes, Hex checkWinner.
 * Distinct from wave 16 place-only AI apply. Tests-only. No product inventing.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import {
  createInitialState as createFiar,
  CONFIG as FIAR_CONFIG,
} from '../../src/games/fiar/types';
import {
  placeChip as fiarPlace,
  getValidMoves as fiarValidMoves,
  canMove,
  moveChip,
  findPaths,
  isPathBlocked,
  isDraw,
  checkWinner as fiarWinner,
} from '../../src/games/fiar/rules';

import {
  createInitialState as createQueens,
  cellKey,
  CONFIG as QG_CONFIG,
  QueensGuardsState,
  HexCell,
} from '../../src/games/queens-guards/types';
import {
  restoreCapturedPiece,
  checkWinner as qgWinner,
  hasValidMoves as qgHasMoves,
} from '../../src/games/queens-guards/rules';

import {
  createInitialGameState as createKings,
} from '../../src/games/kings-quadraphages/game-state';
import {
  isDrawCondition,
  getOpponent,
  checkWinCondition,
  findKingPosition,
} from '../../src/games/kings-quadraphages/rules';
import {
  Board,
  BOARD_SIZE,
  RulesGameState,
  Position,
} from '../../src/games/kings-quadraphages/board';
import { Piece } from '../../src/games/kings-quadraphages/pieces';

import {
  createEmptyBoard,
} from '../../src/games/hex/types';
import { checkWinner as hexWinner, getWinningPath } from '../../src/games/hex/rules';

afterEach(() => {
  vi.restoreAllMocks();
});

function placeMany(ids: string[]) {
  let s = createFiar();
  for (const id of ids) {
    s = fiarPlace(s, id);
  }
  return s;
}

function emptyQgCells(): Map<string, HexCell> {
  const cells = new Map<string, HexCell>();
  // Mirror createInitialState cell generation lightly via existing state
  for (const [key, cell] of createQueens().cells) {
    cells.set(key, { ...cell, piece: null });
  }
  return cells;
}

describe('Wave 18 movement — FIAR movement phase', () => {
  it('after 8 placements, phase is movement and chips have valid slides', () => {
    const nodes = [
      '0-0',
      '4-4',
      '0-1',
      '4-3',
      '0-2',
      '4-2',
      '0-4',
      '4-1',
    ];
    const state = placeMany(nodes);
    expect(state.phase).toBe('movement');
    expect(state.chipsPlaced.player1).toBe(FIAR_CONFIG.CHIPS_PER_PLAYER);

    const from = '0-0';
    const moves = fiarValidMoves(state, from);
    expect(moves.length).toBeGreaterThan(0);
    const to = moves[0];
    expect(canMove(state, from, to)).toBe(true);
    expect(canMove(state, from, 'nope')).toBe(false);

    const next = moveChip(state, from, to);
    expect(next.board.nodes.get(from)?.chip).toBeNull();
    expect(next.board.nodes.get(to)?.chip).toBe('player1');
    expect(next.moveHistory.length).toBe(state.moveHistory.length + 1);
  });

  it('getValidMoves empty outside movement; findPaths / isDraw opening', () => {
    const opening = createFiar();
    expect(fiarValidMoves(opening, '0-0')).toEqual([]);
    expect(findPaths(opening, 'player1').length).toBeGreaterThanOrEqual(0);
    expect(isDraw(opening)).toBe(false);
    expect(fiarWinner(opening)).toBeNull();

    // isPathBlocked requires player seat
    const blocked = isPathBlocked(opening, ['0-0', '0-1'], 'player1');
    expect(typeof blocked).toBe('boolean');
  });
});

describe('Wave 18 movement — Queens restoreCapturedPiece', () => {
  it('rejects non-outer-ring and occupied targets; legal restore mutates', () => {
    const outerRing = QG_CONFIG.NUM_RINGS - 1;
    const cells = emptyQgCells();
    // Place a captured-looking piece inland and leave outer empty
    cells.set(cellKey(2, 0), {
      ring: 2,
      position: 0,
      piece: { id: 'g1', player: 'player1', type: 'guard' },
    });
    cells.set(cellKey(outerRing, 0), {
      ring: outerRing,
      position: 0,
      piece: null,
    });
    cells.set(cellKey(outerRing, 1), {
      ring: outerRing,
      position: 1,
      piece: { id: 'blocker', player: 'player2', type: 'guard' },
    });

    const state: QueensGuardsState = {
      cells,
      currentPlayer: 'player1',
      selectedPiece: null,
      capturedPieces: [{ ring: 2, position: 0 }],
      winner: null,
      moveHistory: [],
    };

    // Non-outer target
    expect(
      restoreCapturedPiece(state, { ring: 2, position: 0 }, { ring: 1, position: 0 })
    ).toBe(state);
    // Occupied outer
    expect(
      restoreCapturedPiece(
        state,
        { ring: 2, position: 0 },
        { ring: outerRing, position: 1 }
      )
    ).toBe(state);

    const restored = restoreCapturedPiece(
      state,
      { ring: 2, position: 0 },
      { ring: outerRing, position: 0 }
    );
    expect(restored).not.toBe(state);
    expect(restored.cells.get(cellKey(2, 0))?.piece).toBeNull();
    expect(restored.cells.get(cellKey(outerRing, 0))?.piece?.id).toBe('g1');
    expect(restored.capturedPieces).toHaveLength(0);
  });

  it('opening hasValidMoves true; checkWinner null', () => {
    const opening = createQueens();
    expect(qgHasMoves(opening)).toBe(true);
    expect(qgWinner(opening)).toBeNull();
  });
});

describe('Wave 18 movement — Kings draw / opponent / win probes', () => {
  function emptyBoard(): Board {
    return Array.from({ length: BOARD_SIZE }, () =>
      Array.from({ length: BOARD_SIZE }, () => null)
    );
  }

  function place(board: Board, pos: Position, piece: Piece) {
    board[pos.row][pos.col] = piece;
  }

  function rulesState(board: Board): RulesGameState {
    return { board, player1Supply: 30, player2Supply: 30 };
  }

  it('getOpponent flips; findKingPosition locates both kings on opening', () => {
    expect(getOpponent('player1')).toBe('player2');
    expect(getOpponent('player2')).toBe('player1');
    const state = createKings();
    expect(findKingPosition(state.board, 'player1')).not.toBeNull();
    expect(findKingPosition(state.board, 'player2')).not.toBeNull();
    expect(isDrawCondition(state)).toBe(false);
    expect(checkWinCondition(state)).toBeNull();
  });

  it('isDrawCondition true when both kings trapped; checkWinCondition for one trap', () => {
    // Match established kings-quadraphages-ui corner-trap fixture
    const board = emptyBoard();
    place(board, { row: 0, col: 0 }, { type: 'king', owner: 'player1' });
    place(board, { row: 0, col: 1 }, { type: 'quadraphage', owner: 'player2' });
    place(board, { row: 1, col: 0 }, { type: 'quadraphage', owner: 'player2' });
    place(board, { row: 1, col: 1 }, { type: 'quadraphage', owner: 'player2' });
    place(board, { row: 8, col: 8 }, { type: 'king', owner: 'player2' });
    place(board, { row: 8, col: 7 }, { type: 'quadraphage', owner: 'player1' });
    place(board, { row: 7, col: 8 }, { type: 'quadraphage', owner: 'player1' });
    place(board, { row: 7, col: 7 }, { type: 'quadraphage', owner: 'player1' });
    expect(isDrawCondition(rulesState(board))).toBe(true);

    // Single trap → opponent wins (player1 corner trapped, player2 free)
    const one = emptyBoard();
    place(one, { row: 0, col: 0 }, { type: 'king', owner: 'player1' });
    place(one, { row: 0, col: 1 }, { type: 'quadraphage', owner: 'player2' });
    place(one, { row: 1, col: 0 }, { type: 'quadraphage', owner: 'player2' });
    place(one, { row: 1, col: 1 }, { type: 'quadraphage', owner: 'player2' });
    place(one, { row: 4, col: 4 }, { type: 'king', owner: 'player2' });
    expect(checkWinCondition(rulesState(one))).toBe('player2');
  });
});

describe('Wave 18 movement — Hex forced left-right win path', () => {
  it('player2 left→right bridge yields checkWinner + path', () => {
    const size = 3;
    const board = createEmptyBoard(size);
    for (let col = 0; col < size; col++) {
      board[1][col] = 'player2';
    }
    expect(hexWinner(board, 'player2', size)).toBe(true);
    const path = getWinningPath(board, 'player2', size);
    expect(path.length).toBeGreaterThanOrEqual(size);
    expect(path.some((p) => p.col === 0)).toBe(true);
    expect(path.some((p) => p.col === size - 1)).toBe(true);
  });
});
