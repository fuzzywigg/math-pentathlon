/**
 * Overnight HEAVY after #210 — Cross-engine handshake leftovers distinct from #210 openings.
 * Default-diff / rolling / getRandomMove / apply restore gates only.
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { getAIAnswer } from '../../src/games/fraction-pinball/ai';
import {
  getAIIslandChoice,
  isAITurn as remIsAI,
} from '../../src/games/remainder-islands/ai';
import {
  getRandomMove,
  getAIMove as kingsAI,
} from '../../src/games/kings-quadraphages/ai';
import { getAIMove as queensAI } from '../../src/games/queens-guards/ai';
import { createInitialState as pinballInit } from '../../src/games/fraction-pinball/types';
import { createInitialState as remInit } from '../../src/games/remainder-islands/types';
import {
  Board,
  BOARD_SIZE,
  type RulesGameState,
  type Position,
} from '../../src/games/kings-quadraphages/board';
import { type Piece } from '../../src/games/kings-quadraphages/pieces';
import {
  createInitialState as queensInit,
  cellKey,
  CONFIG,
} from '../../src/games/queens-guards/types';
import { findValidIslands } from '../../src/games/remainder-islands/rules';
import { restoreCapturedPiece } from '../../src/games/queens-guards/rules';

afterEach(() => {
  vi.restoreAllMocks();
});

function emptyBoard(): Board {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => null)
  );
}

function place(board: Board, pos: Position, piece: Piece): void {
  board[pos.row][pos.col] = piece;
}

describe('Overnight handshake — deepen leftovers after #210', () => {
  it('pinball default-diff + remainder rolling + kings random + queens restore apply', () => {
    // Pinball: omitted difficulty behaves (hit path)
    const pin = {
      ...pinballInit(),
      phase: 'answering' as const,
      currentPlayer: 'player1' as const,
      currentChallenge: {
        id: 'hs2',
        type: 'fractionToDecimal' as const,
        fraction: { numerator: 1, denominator: 2 },
        decimal: 0.5,
        answerChoices: ['0.5', '0.25', '0.75'],
        correctAnswer: '0.5',
      },
    };
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    expect(getAIAnswer(pin, 'player1')).toBe('0.5');

    // Remainder: rolling seat true but choice null
    const rem = remInit();
    expect(remIsAI(rem, 'player1')).toBe(true);
    expect(getAIIslandChoice(rem, 'player1', 'medium')).toBeNull();

    // Kings: getRandomMove alias returns legal on open board
    const board = emptyBoard();
    place(board, { row: 4, col: 4 }, { type: 'king', owner: 'player1' });
    place(board, { row: 0, col: 4 }, { type: 'king', owner: 'player2' });
    const kings: RulesGameState = {
      board,
      player1Supply: 20,
      player2Supply: 20,
    };
    const rand = getRandomMove(kings, 'player1');
    expect(rand).not.toBeNull();
    expect(kingsAI(kings, 'player1', 'easy')).not.toBeNull();

    // Queens: restore choice + rules restore on empty outer
    const qBase = queensInit();
    const cells = new Map(qBase.cells);
    for (const [k, c] of cells) {
      cells.set(k, { ...c, piece: null });
    }
    const captured = { ring: 2, position: 0 };
    cells.set(cellKey(2, 0), {
      ...cells.get(cellKey(2, 0))!,
      piece: { id: 'hs-cap', player: 'player2', type: 'guard' },
    });
    const queens = {
      ...qBase,
      cells,
      currentPlayer: 'player1' as const,
      capturedPieces: [captured],
      winner: null,
      moveHistory: [],
    };
    const qMove = queensAI(queens, 'player1', 'hard');
    expect(qMove).not.toBeNull();
    expect(qMove!.to.ring).toBe(CONFIG.NUM_RINGS - 1);
    const applied = restoreCapturedPiece(queens, qMove!.from, qMove!.to);
    expect(
      applied.cells.get(cellKey(qMove!.to.ring, qMove!.to.position))?.piece?.id
    ).toBe('hs-cap');

    // Remainder select path still finds ids when phase correct
    const roll = { die1: 2, die2: 3, total: 5 };
    const remSelect = {
      ...rem,
      phase: 'selectIsland' as const,
      currentRoll: roll,
      validIslands: findValidIslands(rem, roll.total),
    };
    vi.restoreAllMocks();
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    expect(getAIIslandChoice(remSelect, 'player1', 'hard')?.islandId).toBeTruthy();
  });
});
