/**
 * Wave 42 — Prime Gold CONFIG / DICE_CONFIG catalog leftovers after #186. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { CONFIG, DICE_CONFIG } from '../../src/games/prime-gold/types';
import { createInitialState } from '../../src/games/prime-gold/rules';

describe('Wave 42 prime — CONFIG / DICE_CONFIG catalog', () => {
  it('CONFIG board and chip constants match 7×7 spiral game', () => {
    expect(CONFIG.BOARD_SIZE).toBe(7);
    expect(CONFIG.STARTING_CHIPS).toBe(20);
    expect(CONFIG.VEINS_TO_WIN).toBe(4);
    expect(CONFIG.MIN_VEIN_LENGTH).toBe(4);
    expect(CONFIG.BOARD_SIZE * CONFIG.BOARD_SIZE).toBe(49);
  });

  it('DICE_CONFIG defines d6 / d8 / d10 style ranges', () => {
    expect(DICE_CONFIG.die1).toEqual({ min: 1, max: 6 });
    expect(DICE_CONFIG.die2).toEqual({ min: 1, max: 8 });
    expect(DICE_CONFIG.die3).toEqual({ min: 1, max: 10 });
  });

  it('initial state cell count aligns with CONFIG.BOARD_SIZE', () => {
    const state = createInitialState();
    expect(state.cells.size).toBe(CONFIG.BOARD_SIZE ** 2);
    expect(state.playerChips.player1 + state.playerChips.player2).toBe(
      CONFIG.STARTING_CHIPS * 2
    );
  });

  it('win threshold exceeds minimum vein length', () => {
    expect(CONFIG.VEINS_TO_WIN).toBeGreaterThan(0);
    expect(CONFIG.MIN_VEIN_LENGTH).toBeGreaterThanOrEqual(3);
  });
});
