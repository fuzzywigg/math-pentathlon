/**
 * Wave 41 — Sum Dominoes createInitialState leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createInitialState, getRemainingCount } from '../../src/games/sum-dominoes/rules';
import { CONFIG } from '../../src/games/sum-dominoes/types';

describe('Wave 41 sum-dominoes — createInitialState', () => {
  it('deals starting hands and seeds center cell', () => {
    const state = createInitialState();
    expect(state.hands.player1).toHaveLength(CONFIG.STARTING_HAND_SIZE);
    expect(state.hands.player2).toHaveLength(CONFIG.STARTING_HAND_SIZE);
    expect(state.board[CONFIG.CENTER_ROW][CONFIG.CENTER_COL]).not.toBeNull();
    expect(state.phase).toBe('rolling');
    expect(state.currentPlayer).toBe('player1');
    expect(state.selectedDomino).toBeNull();
    expect(state.currentDice).toBeNull();
    expect(state.winner).toBeNull();
    expect(state.passCount).toBe(0);
  });

  it('remaining counts match dealt hand sizes', () => {
    const state = createInitialState();
    expect(getRemainingCount(state, 'player1')).toBe(CONFIG.STARTING_HAND_SIZE);
    expect(getRemainingCount(state, 'player2')).toBe(CONFIG.STARTING_HAND_SIZE);
  });

  it('board is BOARD_SIZE square with center seed present', () => {
    const state = createInitialState();
    expect(state.board).toHaveLength(CONFIG.BOARD_SIZE);
    let occupied = 0;
    for (let r = 0; r < CONFIG.BOARD_SIZE; r++) {
      expect(state.board[r]).toHaveLength(CONFIG.BOARD_SIZE);
      for (let c = 0; c < CONFIG.BOARD_SIZE; c++) {
        if (state.board[r][c]) occupied++;
      }
    }
    // createInitialState seeds only the anchor cell (not the second span)
    expect(occupied).toBeGreaterThanOrEqual(1);
    expect(state.board[CONFIG.CENTER_ROW][CONFIG.CENTER_COL]).not.toBeNull();
  });
});
