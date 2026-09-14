/**
 * Wave 41 handshake — Juggle board fill × core dice roll totals.
 * Game×core using real exports. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  createInitialState,
  doRollDice,
  getBoardFillPercentage,
} from '../../src/games/juggle/rules';
import { CONFIG } from '../../src/games/juggle/types';
import { createBoard } from '../../src/core/polyomino/placement';
import { roll, getSelectedTotal, selectDice } from '../../src/core/dice';

afterEach(() => vi.restoreAllMocks());

describe('Wave 41 handshake — juggle × dice fill', () => {
  it('empty juggle board fill is 0; full board is 100', () => {
    const state = createInitialState();
    expect(getBoardFillPercentage(state.boards.player1)).toBe(0);
    const full = createBoard(CONFIG.GRID_SIZE, CONFIG.GRID_SIZE);
    for (let r = 0; r < CONFIG.GRID_SIZE; r++) {
      for (let c = 0; c < CONFIG.GRID_SIZE; c++) {
        full.cells[r][c] = true;
      }
    }
    expect(getBoardFillPercentage(full)).toBe(100);
  });

  it('doRollDice enters selectingShape; core roll totals stay in die range', () => {
    let i = 0;
    const seq = [0.1, 0.3, 0.5, 0.7, 0.2, 0.9, 0.4, 0.6];
    vi.spyOn(Math, 'random').mockImplementation(() => {
      const v = seq[i % seq.length];
      i++;
      return v;
    });
    const rolled = doRollDice(createInitialState());
    expect(rolled.phase).toBe('selectingShape');
    expect(rolled.currentDice).not.toBeNull();
    expect(rolled.currentDice![0]).toBeGreaterThanOrEqual(1);
    expect(rolled.currentDice![0]).toBeLessThanOrEqual(6);

    let core = roll('d6', 'd6');
    expect(core.rolls).toHaveLength(2);
    expect(core.total).toBeGreaterThanOrEqual(2);
    expect(core.total).toBeLessThanOrEqual(12);
    core = selectDice(core, [core.rolls[0].id, core.rolls[1].id], true);
    expect(getSelectedTotal(core)).toBe(core.total);
  });
});
