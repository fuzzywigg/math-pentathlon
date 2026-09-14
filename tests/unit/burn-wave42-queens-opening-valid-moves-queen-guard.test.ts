/**
 * Wave 42 — Queens & Guards opening getValidMoves queen vs guard leftovers after #186.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { getValidMoves } from '../../src/games/queens-guards/rules';
import {
  createInitialState,
  parseKey,
  CONFIG,
} from '../../src/games/queens-guards/types';

describe('Wave 42 queens — opening getValidMoves queen vs guards', () => {
  it('player1 queen on outer ring has valid opening moves', () => {
    const state = createInitialState();
    const outer = CONFIG.NUM_RINGS - 1;
    const moves = getValidMoves(state, { ring: outer, position: 7 });
    expect(moves.length).toBeGreaterThan(0);
    expect(moves.every((m) => m.ring <= outer)).toBe(true);
    expect(moves.some((m) => m.ring === outer - 1)).toBe(true);
  });

  it('player1 guards each have at least one valid move at opening', () => {
    const state = createInitialState();
    let guardCount = 0;
    for (const [key, cell] of state.cells) {
      if (cell.piece?.player !== 'player1' || cell.piece.type !== 'guard') {
        continue;
      }
      guardCount++;
      const moves = getValidMoves(state, parseKey(key));
      expect(moves.length).toBeGreaterThan(0);
    }
    expect(guardCount).toBe(CONFIG.GUARDS_PER_PLAYER);
  });

  it('queen and guard opening move counts are positive and throne never listed', () => {
    const state = createInitialState();
    const outer = CONFIG.NUM_RINGS - 1;
    const queenMoves = getValidMoves(state, { ring: outer, position: 7 });
    expect(queenMoves.length).toBe(4);
    expect(queenMoves.some((m) => m.ring === 0)).toBe(false);

    for (const [key, cell] of state.cells) {
      if (cell.piece?.player !== 'player1' || cell.piece.type !== 'guard') {
        continue;
      }
      const moves = getValidMoves(state, parseKey(key));
      expect(moves.some((m) => m.ring === 0)).toBe(false);
    }
  });

  it('player2 pieces yield no moves while player1 is seated', () => {
    const state = createInitialState();
    for (const [key, cell] of state.cells) {
      if (cell.piece?.player === 'player2') {
        expect(getValidMoves(state, parseKey(key))).toEqual([]);
      }
    }
  });
});
