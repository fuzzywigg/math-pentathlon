/**
 * Wave 43 — Juggle canMakeAnyMove false when board jammed for dice. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createInitialState, canMakeAnyMove } from '../../src/games/juggle/rules';
import { SHAPE_POOLS } from '../../src/games/juggle/types';
import { placePolyomino } from '../../src/core/polyomino/placement';

describe('Wave 43 juggle — canMakeAnyMove jammed', () => {
  it('full board cannot place any die option', () => {
    const mono = SHAPE_POOLS.monomino[0];
    let board = createInitialState().boards.player1;
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        board = placePolyomino(board, mono, { row, col }, 0, false, 1);
      }
    }
    const s = {
      ...createInitialState(),
      boards: { player1: board, player2: createInitialState().boards.player2 },
      currentDice: [5, 6] as [number, number],
    };
    expect(canMakeAnyMove(s)).toBe(false);
  });
});
