/**
 * Wave 35 — Juggle board-fill win settle + jammed canMakeAnyMove.
 * Distinct from wave14 phase identity and wave18 rotate/flip cycles.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import { CONFIG } from '../../src/games/juggle/types';
import { createInitialState } from '../../src/games/juggle/rules';
import {
  checkWinner,
  canMakeAnyMove,
  getBoardFillPercentage,
  selectDie,
} from '../../src/games/juggle/rules';
import { createBoard } from '../../src/core/polyomino/placement';

function fillBoard(rows: number, cols: number) {
  const board = createBoard(rows, cols);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      board.cells[r][c] = true;
    }
  }
  return board;
}

function jamNearFull() {
  const board = createBoard(CONFIG.GRID_SIZE, CONFIG.GRID_SIZE);
  for (let r = 0; r < CONFIG.GRID_SIZE; r++) {
    for (let c = 0; c < CONFIG.GRID_SIZE; c++) {
      board.cells[r][c] = true;
    }
  }
  return board;
}

describe('Wave 35 Juggle — win/fill settle', () => {
  it('checkWinner returns player1 when P1 board filled first', () => {
    const boards = {
      player1: fillBoard(CONFIG.GRID_SIZE, CONFIG.GRID_SIZE),
      player2: createBoard(CONFIG.GRID_SIZE, CONFIG.GRID_SIZE),
    };
    expect(checkWinner(boards)).toBe('player1');
  });

  it('checkWinner returns player2 when only P2 filled', () => {
    const boards = {
      player1: createBoard(CONFIG.GRID_SIZE, CONFIG.GRID_SIZE),
      player2: fillBoard(CONFIG.GRID_SIZE, CONFIG.GRID_SIZE),
    };
    expect(checkWinner(boards)).toBe('player2');
  });

  it('checkWinner short-circuits to player1 when both boards filled', () => {
    const boards = {
      player1: fillBoard(CONFIG.GRID_SIZE, CONFIG.GRID_SIZE),
      player2: fillBoard(CONFIG.GRID_SIZE, CONFIG.GRID_SIZE),
    };
    expect(checkWinner(boards)).toBe('player1');
  });

  it('checkWinner null when neither board filled', () => {
    const boards = {
      player1: createBoard(CONFIG.GRID_SIZE, CONFIG.GRID_SIZE),
      player2: createBoard(CONFIG.GRID_SIZE, CONFIG.GRID_SIZE),
    };
    expect(checkWinner(boards)).toBeNull();
  });

  it('canMakeAnyMove false with dice on fully jammed own board', () => {
    const state = {
      ...createInitialState(),
      boards: {
        player1: jamNearFull(),
        player2: createBoard(CONFIG.GRID_SIZE, CONFIG.GRID_SIZE),
      },
      currentDice: [4, 5] as [number, number],
      phase: 'selectingShape' as const,
    };
    expect(canMakeAnyMove(state)).toBe(false);
  });

  it('getBoardFillPercentage is 100 on full board and 0 on empty', () => {
    expect(getBoardFillPercentage(createBoard(9, 9))).toBe(0);
    expect(getBoardFillPercentage(fillBoard(9, 9))).toBe(100);
  });

  it('getBoardFillPercentage rounds partial occupancy', () => {
    const board = createBoard(9, 9);
    board.cells[0][0] = true;
    expect(getBoardFillPercentage(board)).toBe(Math.round((1 / 81) * 100));
  });

  it('selectDie identity when currentDice is null even if phase forged', () => {
    const state = {
      ...createInitialState(),
      phase: 'selectingShape' as const,
      currentDice: null,
    };
    expect(selectDie(state, 0)).toBe(state);
  });
});
