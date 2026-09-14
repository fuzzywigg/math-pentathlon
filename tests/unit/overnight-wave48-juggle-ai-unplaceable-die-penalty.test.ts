/**
 * Wave 48 overnight — Juggle AI unplaceable die −1000 penalty. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/juggle/rules';
import { getAIDieChoice } from '../../src/games/juggle/ai';
import { createBoard } from '../../src/core/polyomino/placement';
import { CONFIG, type JuggleState } from '../../src/games/juggle/types';

afterEach(() => vi.restoreAllMocks());

describe('Wave 48 juggle overnight — unplaceable die penalty', () => {
  it('avoids die whose shapes cannot fit', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const board = createBoard(CONFIG.GRID_SIZE, CONFIG.GRID_SIZE);
    for (let r = 0; r < CONFIG.GRID_SIZE; r++) {
      for (let c = 0; c < CONFIG.GRID_SIZE; c++) {
        if (!(r === 0 && c === 0)) board.cells[r][c] = true;
      }
    }
    const state: JuggleState = {
      ...createInitialState(),
      boards: { player1: board, player2: createBoard(CONFIG.GRID_SIZE, CONFIG.GRID_SIZE) },
      currentDice: [1, 5],
      phase: 'selectingShape',
    };
    const choice = getAIDieChoice(state, 'player1', 'hard');
    expect(choice).not.toBeNull();
    expect(choice!.index).toBe(0);
  });
});
