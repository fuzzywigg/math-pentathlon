/**
 * Wave 41 — Juggle checkWinner + canMakeAnyMove dense matrix.
 * Full/empty boards + dice-null gate. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createBoard } from '../../src/core/polyomino/placement';
import { CONFIG } from '../../src/games/juggle/types';
import {
  createInitialState,
  checkWinner,
  canMakeAnyMove,
} from '../../src/games/juggle/rules';

function fillAll() {
  const board = createBoard(CONFIG.GRID_SIZE, CONFIG.GRID_SIZE);
  for (let r = 0; r < CONFIG.GRID_SIZE; r++) {
    for (let c = 0; c < CONFIG.GRID_SIZE; c++) {
      board.cells[r][c] = true;
    }
  }
  return board;
}

describe('Wave 41 juggle — checkWinner / canMakeAnyMove', () => {
  it('checkWinner null when neither filled', () => {
    expect(
      checkWinner({
        player1: createBoard(CONFIG.GRID_SIZE, CONFIG.GRID_SIZE),
        player2: createBoard(CONFIG.GRID_SIZE, CONFIG.GRID_SIZE),
      })
    ).toBeNull();
  });

  it('checkWinner prefers player1 when both full', () => {
    expect(
      checkWinner({ player1: fillAll(), player2: fillAll() })
    ).toBe('player1');
  });

  it('checkWinner matrix for single-side fills', () => {
    expect(
      checkWinner({
        player1: fillAll(),
        player2: createBoard(CONFIG.GRID_SIZE, CONFIG.GRID_SIZE),
      })
    ).toBe('player1');
    expect(
      checkWinner({
        player1: createBoard(CONFIG.GRID_SIZE, CONFIG.GRID_SIZE),
        player2: fillAll(),
      })
    ).toBe('player2');
  });

  it('canMakeAnyMove false without dice', () => {
    expect(canMakeAnyMove(createInitialState())).toBe(false);
    expect(
      canMakeAnyMove({
        ...createInitialState(),
        phase: 'selectingShape',
        currentDice: null,
      })
    ).toBe(false);
  });

  it('canMakeAnyMove true with monomino die on empty board', () => {
    const state = {
      ...createInitialState(),
      phase: 'selectingShape' as const,
      currentDice: [1, 1] as [number, number],
    };
    expect(canMakeAnyMove(state)).toBe(true);
  });

  it('canMakeAnyMove false when own board fully jammed', () => {
    const state = {
      ...createInitialState(),
      boards: {
        player1: fillAll(),
        player2: createBoard(CONFIG.GRID_SIZE, CONFIG.GRID_SIZE),
      },
      currentDice: [1, 6] as [number, number],
      phase: 'selectingShape' as const,
    };
    expect(canMakeAnyMove(state)).toBe(false);
  });
});
