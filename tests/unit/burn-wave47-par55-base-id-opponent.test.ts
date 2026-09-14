/**
 * Wave 47 leftover after #214/#215 — Par 55 createBaseId / getOpponent leftovers after #186. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createInitialState } from '../../src/games/par-55/rules';
import {
  createBaseId,
  getOpponent,
  CONFIG,
  type Player,
} from '../../src/games/par-55/types';

describe('Wave 47 par deepen 7 — Wave 47 par55 — base id and opponent', () => {
  it('createBaseId formats row-col consistently', () => {
    expect(createBaseId(0, 0)).toBe('base-0-0');
    expect(createBaseId(2, 3)).toBe('base-2-3');
    expect(createBaseId(4, 6)).toBe('base-4-6');
  });

  it('every board base id round-trips through createBaseId', () => {
    const state = createInitialState();
    for (const base of state.bases.values()) {
      expect(createBaseId(base.row, base.col)).toBe(base.id);
    }
  });

  it('getOpponent toggles player1 ↔ player2', () => {
    const players: Player[] = ['player1', 'player2'];
    expect(getOpponent('player1')).toBe('player2');
    expect(getOpponent('player2')).toBe('player1');
    expect(getOpponent(getOpponent('player1'))).toBe('player1');
    for (const p of players) {
      expect(getOpponent(getOpponent(p))).toBe(p);
    }
  });

  it('missing row/col combos are absent from initial board', () => {
    const state = createInitialState();
    for (let row = 0; row < CONFIG.BOARD_ROWS; row++) {
      const cols =
        row % 2 === 1 ? CONFIG.BOARD_COLS - 1 : CONFIG.BOARD_COLS;
      for (let col = 0; col < CONFIG.BOARD_COLS; col++) {
        const id = createBaseId(row, col);
        if (col < cols) {
          expect(state.bases.has(id)).toBe(true);
        } else {
          expect(state.bases.has(id)).toBe(false);
        }
      }
    }
  });
});
