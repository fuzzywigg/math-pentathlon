/**
 * Wave 48 — Juggle AI late-game size bias (random=0). Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/juggle/rules';
import { getAIDieChoice } from '../../src/games/juggle/ai';
import { createBoard } from '../../src/core/polyomino/placement';
import { CONFIG, type JuggleState } from '../../src/games/juggle/types';

afterEach(() => vi.restoreAllMocks());

describe('Wave 48 juggle — AI late-game size bias', () => {
  it('hard random=0 prefers placeable smaller die on crowded board', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const board = createBoard(CONFIG.GRID_SIZE, CONFIG.GRID_SIZE);
    for (let r = 0; r < CONFIG.GRID_SIZE; r++) {
      for (let c = 0; c < CONFIG.GRID_SIZE; c++) {
        if (r > 1 || c > 1) board.cells[r][c] = true;
      }
    }
    const state: JuggleState = {
      ...createInitialState(),
      boards: { player1: board, player2: createBoard(CONFIG.GRID_SIZE, CONFIG.GRID_SIZE) },
      currentDice: [1, 6],
      phase: 'selectingShape',
    };
    const choice = getAIDieChoice(state, 'player1', 'hard');
    expect(choice).not.toBeNull();
    expect(choice!.index).toBe(0);
  });
});
