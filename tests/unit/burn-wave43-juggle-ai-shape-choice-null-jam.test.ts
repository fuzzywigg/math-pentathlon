/**
 * Wave 43 — getAIShapeChoice null when jammed leftover. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState, doRollDice } from '../../src/games/juggle/rules';
import { getAIShapeChoice } from '../../src/games/juggle/ai';
import { createBoard } from '../../src/core/polyomino/placement';
import { CONFIG } from '../../src/games/juggle/types';

afterEach(() => vi.restoreAllMocks());

describe('Wave 43 juggle — AI shape null jam', () => {
  it('full board yields null shape choice', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.8);
    let s = doRollDice(createInitialState());
    const board = createBoard(CONFIG.GRID_SIZE, CONFIG.GRID_SIZE);
    for (let r = 0; r < CONFIG.GRID_SIZE; r++) {
      for (let c = 0; c < CONFIG.GRID_SIZE; c++) {
        board.cells[r][c] = true;
      }
    }
    s = {
      ...s,
      boards: { ...s.boards, player1: board },
      selectedCategory: 'pentomino',
      phase: 'selectingShape',
    };
    expect(getAIShapeChoice(s, 'player1', 'hard')).toBeNull();
  });
});
