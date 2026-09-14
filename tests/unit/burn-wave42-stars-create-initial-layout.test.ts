/**
 * Wave 42 — Stars & Bars createInitialState layout leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createInitialState } from '../../src/games/stars-bars/rules';
import { CONFIG } from '../../src/games/stars-bars/types';

describe('Wave 42 stars — createInitialState layout', () => {
  it('hands are HAND_SIZE and board is BOARD_SIZE square', () => {
    const state = createInitialState();
    expect(state.playerHands.player1).toHaveLength(CONFIG.HAND_SIZE);
    expect(state.playerHands.player2).toHaveLength(CONFIG.HAND_SIZE);
    expect(state.cells).toHaveLength(CONFIG.BOARD_SIZE);
    expect(state.cells.every((row) => row.length === CONFIG.BOARD_SIZE)).toBe(true);
  });

  it('star cells only at corners and center', () => {
    const state = createInitialState();
    const stars = state.cells
      .flat()
      .filter((c) => c.isStar)
      .map((c) => `${c.row},${c.col}`)
      .sort();
    expect(stars).toEqual(['0,0', '0,4', '2,2', '4,0', '4,4']);
    expect(state.cells[1][1].isStar).toBe(false);
  });

  it('deck remaining is 60 minus both hands; opening seat and phase', () => {
    const state = createInitialState();
    expect(state.deck).toHaveLength(60 - CONFIG.HAND_SIZE * 2);
    expect(state.currentPlayer).toBe('player1');
    expect(state.phase).toBe('selectingCard');
    expect(state.selectedCard).toBeNull();
    expect(state.lastMove).toBeNull();
    expect(state.winner).toBeNull();
  });
});
