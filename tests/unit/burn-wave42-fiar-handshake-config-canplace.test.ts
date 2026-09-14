/**
 * Wave 42 — FIAR handshake CONFIG ↔ rules canPlaceChip fence. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { canPlaceChip, placeChip } from '../../src/games/fiar/rules';
import { createInitialState, CONFIG } from '../../src/games/fiar/types';

describe('Wave 42 fiar — handshake config canPlaceChip', () => {
  it('CONFIG.CHIPS_PER_PLAYER fences canPlaceChip after exact quota', () => {
    expect(CONFIG.CHIPS_PER_PLAYER).toBe(4);
    const state = {
      ...createInitialState(),
      chipsPlaced: {
        player1: CONFIG.CHIPS_PER_PLAYER,
        player2: 0,
      },
    };
    expect(canPlaceChip(state, '3-3')).toBe(false);
    expect(placeChip(state, '3-3')).toBe(state);
  });

  it('one under quota still allows place for current seat', () => {
    const state = {
      ...createInitialState(),
      chipsPlaced: {
        player1: CONFIG.CHIPS_PER_PLAYER - 1,
        player2: CONFIG.CHIPS_PER_PLAYER,
      },
      currentPlayer: 'player1' as const,
    };
    expect(canPlaceChip(state, '3-3')).toBe(true);
    const next = placeChip(state, '3-3');
    expect(next.chipsPlaced.player1).toBe(CONFIG.CHIPS_PER_PLAYER);
  });

  it('WIN_LENGTH stays 4 and matches placement total for phase flip', () => {
    expect(CONFIG.WIN_LENGTH).toBe(4);
    let state = createInitialState();
    const ids = [...state.board.nodes.keys()];
    const total = CONFIG.CHIPS_PER_PLAYER * 2;
    for (let i = 0; i < total - 1; i++) {
      state = placeChip(state, ids[i]);
      expect(state.phase).toBe('placement');
    }
    state = placeChip(state, ids[total - 1]);
    expect(state.phase).toBe('movement');
  });
});
