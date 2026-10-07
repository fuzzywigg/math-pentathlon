/**
 * Targeted branch coverage for kings-quadraphages rules + game-state —
 * hand-built boards only. Edge-of-board moves, illegal rejection, win/draw
 * corners, turn handoff. Engine code unchanged.
 */
import { describe, it, expect } from 'vitest';

import {
  getValidKingMoves,
  isValidKingMove,
  isValidQuadraphagePlacement,
  checkWinCondition,
  isDrawCondition,
  findKingPosition,
  canCompleteTurn,
  getOpponent,
} from '../../src/games/kings-quadraphages/rules';
import {
  createInitialGameState,
  selectKing,
  moveKing,
  placeQuadraphage,
  endTurn,
  getCurrentPhaseMessage,
  isValidMove,
  isValidPlacement,
  type GameState,
} from '../../src/games/kings-quadraphages/game-state';
import {
  BOARD_SIZE,
  createInitialGameState as createRulesInitial,
  type Board,
} from '../../src/games/kings-quadraphages/board';

function emptyBoard(): Board {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => null)
  );
}

function rulesState(
  board: Board,
  player1Supply = 30,
  player2Supply = 30
): Parameters<typeof getValidKingMoves>[0] {
  return { board, player1Supply, player2Supply };
}

describe('Kings targeted — edge-of-board + illegal rejection', () => {
  it('corner king (0,0) rejects OOB destinations and stay-adjacent empties only', () => {
    const board = emptyBoard();
    board[0][0] = { type: 'king', owner: 'player1' };
    const state = rulesState(board);

    const moves = getValidKingMoves(state, 'player1');
    expect(moves).toHaveLength(3);
    expect(moves).toEqual(
      expect.arrayContaining([
        { row: 0, col: 1 },
        { row: 1, col: 0 },
        { row: 1, col: 1 },
      ])
    );
    expect(isValidKingMove(state, 'player1', { row: -1, col: 0 })).toBe(false);
    expect(isValidKingMove(state, 'player1', { row: 0, col: -1 })).toBe(false);
    expect(isValidKingMove(state, 'player1', { row: 2, col: 2 })).toBe(false);
  });

  it('far-edge king (8,8) has three in-bound moves; OOB placement rejected', () => {
    const board = emptyBoard();
    board[8][8] = { type: 'king', owner: 'player2' };
    const state = rulesState(board);
    expect(getValidKingMoves(state, 'player2')).toHaveLength(3);
    expect(isValidQuadraphagePlacement(state, { row: 9, col: 8 })).toBe(false);
    expect(isValidQuadraphagePlacement(state, { row: 8, col: 9 })).toBe(false);
  });

  it('game-state moveKing / placeQuadraphage reject wrong phase and illegal coords', () => {
    const open = createInitialGameState();
    expect(moveKing(open, { row: 0, col: 0 })).toBe(open); // occupied / not adjacent
    expect(moveKing(open, { row: 99, col: 99 })).toBe(open);

    const selected = selectKing(open);
    const afterMove = moveKing(selected, { row: 2, col: 5 });
    expect(afterMove.turnPhase).toBe('placeQuadraphage');
    expect(moveKing(afterMove, { row: 3, col: 5 })).toBe(afterMove); // wrong phase
    expect(placeQuadraphage(open, { row: 5, col: 5 })).toBe(open); // wrong phase
    expect(isValidMove(afterMove, { row: 3, col: 5 })).toBe(false);
    expect(isValidPlacement(afterMove, { row: 2, col: 5 })).toBe(false); // occupied by king
  });

  it('moveKing is a no-op when the current seat has no king on the board', () => {
    const state = createInitialGameState();
    const board = state.board.map((row) => row.map((c) => (c ? { ...c } : null)));
    board[0][4] = null; // remove player1 king
    const orphan: GameState = { ...state, board };
    expect(findKingPosition(orphan.board, 'player1')).toBeNull();
    expect(moveKing(orphan, { row: 2, col: 5 })).toBe(orphan);
  });
});

describe('Kings targeted — win / draw corners + turn handoff', () => {
  it('endTurn ties when only the incoming opponent has empty supply', () => {
    // Distinct from both-supplies-zero (isDrawCondition): only opponent is empty.
    const state: GameState = {
      ...createInitialGameState(),
      currentPlayer: 'player1',
      player1Supply: 5,
      player2Supply: 0,
      turnPhase: 'placeQuadraphage',
    };
    expect(checkWinCondition(state)).toBeNull();
    expect(isDrawCondition(state)).toBe(false);

    const ended = endTurn(state);
    expect(ended.turnPhase).toBe('gameOver');
    expect(ended.winner).toBeNull();
    expect(ended.currentPlayer).toBe('player2');
    expect(getCurrentPhaseMessage(ended)).toBe('Game Over! Tie!');
  });

  it('normal handoff flips seat to moveKing after a legal place', () => {
    let state = createInitialGameState();
    state = selectKing(state);
    state = moveKing(state, { row: 2, col: 4 });
    expect(state.turnPhase).toBe('placeQuadraphage');
    state = placeQuadraphage(state, { row: 5, col: 5 });
    expect(state.currentPlayer).toBe('player2');
    expect(state.turnPhase).toBe('moveKing');
    expect(getOpponent('player1')).toBe('player2');
    expect(canCompleteTurn(state, 'player2')).toBe(true);
  });

  it('isDrawCondition false when board still has empties and kings are free', () => {
    const state = createRulesInitial();
    expect(isDrawCondition(state)).toBe(false);
    expect(checkWinCondition(state)).toBeNull();
  });
});
