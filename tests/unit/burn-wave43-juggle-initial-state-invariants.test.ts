/**
 * Wave 43 — Juggle createInitialState board/phase invariants. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createInitialState, getBoardFillPercentage } from '../../src/games/juggle/rules';
import { CONFIG } from '../../src/games/juggle/types';

describe('Wave 43 juggle — initial state invariants', () => {
  it('opens in rolling with empty 9x9 boards and null selection', () => {
    const s = createInitialState();
    expect(s.phase).toBe('rolling');
    expect(s.currentPlayer).toBe('player1');
    expect(s.currentDice).toBeNull();
    expect(s.selectedCategory).toBeNull();
    expect(s.selectedShape).toBeNull();
    expect(s.selectedRotation).toBe(0);
    expect(s.selectedFlipped).toBe(false);
    expect(s.winner).toBeNull();
    expect(s.moveHistory).toEqual([]);
    expect(s.boards.player1.rows).toBe(CONFIG.GRID_SIZE);
    expect(s.boards.player1.cols).toBe(CONFIG.GRID_SIZE);
    expect(s.boards.player2.rows).toBe(CONFIG.GRID_SIZE);
    expect(s.boards.player2.cols).toBe(CONFIG.GRID_SIZE);
  });

  it('empty boards report 0% fill', () => {
    const s = createInitialState();
    expect(getBoardFillPercentage(s.boards.player1)).toBe(0);
    expect(getBoardFillPercentage(s.boards.player2)).toBe(0);
  });
});
