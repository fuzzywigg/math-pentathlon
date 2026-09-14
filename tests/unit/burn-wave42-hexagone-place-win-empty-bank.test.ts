/**
 * Wave 42 leftovers D — Hex-a-Gone place win empty bank. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import {
  selectBlock,
  commitSelection,
  placeBlock,
  isGameOver,
} from '../../src/games/hex-a-gone/rules';

describe('Wave 42 D hexagone — placeBlock win via empty bank', () => {
  it('depleting last bank piece so opponent cannot move awards placer', () => {
    let state = createInitialState();
    // Leave only one triangle in bank; keep board mostly open
    state = {
      ...state,
      bank: {
        hexagon: 0,
        trapezoid: 0,
        rhombus: 0,
        triangle: 1,
        square: 0,
      },
    };

    state = selectBlock(state, 'triangle');
    state = commitSelection(state);
    const empty = state.board.find((c) => !c.filled)!;
    state = placeBlock(state, empty.q, empty.r);

    expect(isGameOver(state)).toBe(true);
    expect(state.phase).toBe('gameOver');
    expect(state.winner).toBe('player1');
    expect(state.bank.triangle).toBe(0);
  });
});
