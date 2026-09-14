/**
 * Wave 43 — winning place freezes currentPlayer leftover. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  createInitialState,
  doRollDice,
  selectDie,
  placeShape,
} from '../../src/games/juggle/rules';
import { createBoard } from '../../src/core/polyomino/placement';
import { CONFIG, getShapesForDie } from '../../src/games/juggle/types';

afterEach(() => vi.restoreAllMocks());

describe('Wave 43 juggle — place gameOver freezes seat', () => {
  it('near-full board monomino place sets gameOver and keeps seat', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0); // dice [1,1]
    let s = doRollDice(createInitialState());
    s = selectDie(s, 0);
    const board = createBoard(CONFIG.GRID_SIZE, CONFIG.GRID_SIZE);
    for (let r = 0; r < CONFIG.GRID_SIZE; r++) {
      for (let c = 0; c < CONFIG.GRID_SIZE; c++) {
        if (!(r === 0 && c === 0)) board.cells[r][c] = true;
      }
    }
    s = {
      ...s,
      boards: { ...s.boards, player1: board },
      selectedShape: getShapesForDie(1)[0],
      phase: 'placing',
    };
    const next = placeShape(s, { row: 0, col: 0 });
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
    expect(next.currentPlayer).toBe('player1');
  });
});
