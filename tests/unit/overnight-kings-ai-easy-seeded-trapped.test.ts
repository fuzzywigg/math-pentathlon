/**
 * Overnight HEAVY — Kings easy seeded random + hard/medium trapped null.
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { getAIMove, getRandomMove } from '../../src/games/kings-quadraphages/ai';
import {
  Board,
  BOARD_SIZE,
  RulesGameState,
  Position,
} from '../../src/games/kings-quadraphages/board';
import { Piece } from '../../src/games/kings-quadraphages/pieces';
import { getValidKingMoves } from '../../src/games/kings-quadraphages/rules';
import { createEmptyBoard, placePiece, createRulesState, openingBoard } from './helpers/kings-board';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Overnight kings — easy seeded + trapped null', () => {
  it('easy with random=0 picks first valid king move', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = createRulesState(openingBoard());
    const valids = getValidKingMoves(state, 'player1');
    const move = getAIMove(state, 'player1', 'easy');
    expect(move).not.toBeNull();
    expect(move!.kingMove).toEqual(valids[0]);
  });

  it('getRandomMove aliases easy with seeded random', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const move = getRandomMove(createRulesState(openingBoard()), 'player1');
    expect(move).not.toBeNull();
    expect(move!.quadraphagePlacement.row).toBeGreaterThanOrEqual(0);
  });

  it('hard/medium return null when AI king fully trapped', () => {
    const board = createEmptyBoard();
    placePiece(board, { row: 4, col: 4 }, { type: 'king', owner: 'player1' });
    placePiece(board, { row: 0, col: 0 }, { type: 'king', owner: 'player2' });
    for (const d of [
      [0, 1],
      [1, 0],
      [1, 1],
    ] as const) {
      placePiece(board, { row: d[0], col: d[1] }, {
        type: 'quadraphage',
        owner: 'player1',
      });
    }
    const state = createRulesState(board);
    expect(getAIMove(state, 'player2', 'hard')).toBeNull();
    expect(getAIMove(state, 'player2', 'medium')).toBeNull();
  });
});
