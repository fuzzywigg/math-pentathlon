/**
 * Wave 43 — Juggle canMakeAnyMove near-full board leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createBoard } from '../../src/core/polyomino/placement';
import { CONFIG } from '../../src/games/juggle/types';
import { createInitialState, canMakeAnyMove } from '../../src/games/juggle/rules';

describe('Wave 43 juggle — canMakeAnyMove near full', () => {
  it('false without dice; true with monomino hole; false when packed', () => {
    expect(canMakeAnyMove(createInitialState())).toBe(false);

    const board = createBoard(CONFIG.GRID_SIZE, CONFIG.GRID_SIZE);
    for (let r = 0; r < CONFIG.GRID_SIZE; r++) {
      for (let c = 0; c < CONFIG.GRID_SIZE; c++) board.cells[r][c] = true;
    }
    board.cells[0][0] = false;
    const withHole = {
      ...createInitialState(),
      boards: { player1: board, player2: createBoard(CONFIG.GRID_SIZE, CONFIG.GRID_SIZE) },
      currentDice: [1, 5] as [number, number],
    };
    expect(canMakeAnyMove(withHole)).toBe(true);

    board.cells[0][0] = true;
    expect(
      canMakeAnyMove({ ...withHole, boards: { ...withHole.boards, player1: board } })
    ).toBe(false);
  });
});
