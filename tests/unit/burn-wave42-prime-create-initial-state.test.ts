/**
 * Wave 42 — Prime Gold createInitialState leftovers after #186. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createInitialState } from '../../src/games/prime-gold/rules';
import { CONFIG } from '../../src/games/prime-gold/types';

describe('Wave 42 prime — createInitialState', () => {
  it('spiral board contains every value 1..49 exactly once', () => {
    const state = createInitialState();
    const values = [...state.cells.values()].map((c) => c.value).sort((a, b) => a - b);
    expect(values).toHaveLength(CONFIG.BOARD_SIZE * CONFIG.BOARD_SIZE);
    expect(values[0]).toBe(1);
    expect(values[values.length - 1]).toBe(49);
    for (let n = 1; n <= 49; n++) {
      expect(values).toContain(n);
    }
    expect(new Set(values).size).toBe(49);
  });

  it('center cell holds value 1 with no owner', () => {
    const state = createInitialState();
    const center = Math.floor(CONFIG.BOARD_SIZE / 2);
    const centerCell = state.cells.get(`${center},${center}`);
    expect(centerCell).toBeTruthy();
    expect(centerCell!.value).toBe(1);
    expect(centerCell!.owner).toBeNull();
  });

  it('opens rolling phase with STARTING_CHIPS for both players', () => {
    const state = createInitialState();
    expect(state.phase).toBe('rolling');
    expect(state.diceRoll).toBeNull();
    expect(state.winner).toBeNull();
    expect(state.currentPlayer).toBe('player1');
    expect(state.playerChips.player1).toBe(CONFIG.STARTING_CHIPS);
    expect(state.playerChips.player2).toBe(CONFIG.STARTING_CHIPS);
    expect(state.moveHistory).toEqual([]);
  });

  it('marks prime and Goldbach flags on cells', () => {
    const state = createInitialState();
    const two = [...state.cells.values()].find((c) => c.value === 2);
    const four = [...state.cells.values()].find((c) => c.value === 4);
    expect(two?.isPrime).toBe(true);
    expect(four?.isPrime).toBe(false);
    expect(four?.isGoldbachTarget).toBe(true);
  });
});
