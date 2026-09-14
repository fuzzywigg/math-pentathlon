/**
 * Wave 41 — Juggle checkWinner / jammed canMakeAnyMove / fill% leftovers. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  checkWinner,
  canMakeAnyMove,
  getBoardFillPercentage,
} from '../../src/games/juggle/rules';
import { CONFIG } from '../../src/games/juggle/types';
import { createBoard } from '../../src/core/polyomino/placement';

function fillAll() {
  const board = createBoard(CONFIG.GRID_SIZE, CONFIG.GRID_SIZE);
  for (let r = 0; r < CONFIG.GRID_SIZE; r++) {
    for (let c = 0; c < CONFIG.GRID_SIZE; c++) {
      board.cells[r][c] = true;
    }
  }
  return board;
}

function leaveSingleHole(row: number, col: number) {
  const board = fillAll();
  board.cells[row][col] = false;
  return board;
}

describe('Wave 41 Juggle — checkWinner leftovers', () => {
  it('null on opening boards', () => {
    const s = createInitialState();
    expect(checkWinner(s.boards)).toBeNull();
  });

  it('player1 wins with one hole still empty on player2', () => {
    expect(
      checkWinner({
        player1: fillAll(),
        player2: leaveSingleHole(4, 4),
      })
    ).toBe('player1');
  });

  it('player2 wins only when player1 is not filled', () => {
    expect(
      checkWinner({
        player1: leaveSingleHole(0, 0),
        player2: fillAll(),
      })
    ).toBe('player2');
  });
});

describe('Wave 41 Juggle — canMakeAnyMove jammed leftovers', () => {
  it('true on empty board with any dice', () => {
    const state = {
      ...createInitialState(),
      currentDice: [5, 6] as [number, number],
      phase: 'selectingShape' as const,
    };
    expect(canMakeAnyMove(state)).toBe(true);
  });

  it('false when currentDice is null', () => {
    expect(canMakeAnyMove(createInitialState())).toBe(false);
  });

  it('false when only monomino-sized hole remains but dice demand pentomino', () => {
    const state = {
      ...createInitialState(),
      boards: {
        player1: leaveSingleHole(3, 3),
        player2: createBoard(CONFIG.GRID_SIZE, CONFIG.GRID_SIZE),
      },
      currentDice: [5, 6] as [number, number],
      phase: 'selectingShape' as const,
    };
    expect(canMakeAnyMove(state)).toBe(false);
  });

  it('true when single hole remains and monomino die is available', () => {
    const state = {
      ...createInitialState(),
      boards: {
        player1: leaveSingleHole(8, 8),
        player2: createBoard(CONFIG.GRID_SIZE, CONFIG.GRID_SIZE),
      },
      currentDice: [1, 5] as [number, number],
      phase: 'selectingShape' as const,
    };
    expect(canMakeAnyMove(state)).toBe(true);
  });
});

describe('Wave 41 Juggle — getBoardFillPercentage leftovers', () => {
  it('reports ~50% when half the cells are filled', () => {
    const board = createBoard(CONFIG.GRID_SIZE, CONFIG.GRID_SIZE);
    let filled = 0;
    for (let r = 0; r < CONFIG.GRID_SIZE; r++) {
      for (let c = 0; c < CONFIG.GRID_SIZE; c++) {
        if (filled < 40) {
          board.cells[r][c] = true;
          filled++;
        }
      }
    }
    expect(getBoardFillPercentage(board)).toBe(Math.round((40 / 81) * 100));
  });

  it('reports 99 when one cell remains empty', () => {
    const board = leaveSingleHole(0, 0);
    expect(getBoardFillPercentage(board)).toBe(Math.round((80 / 81) * 100));
  });
});
