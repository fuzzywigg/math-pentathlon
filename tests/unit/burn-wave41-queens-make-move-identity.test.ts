/**
 * Wave 41 — Queens & Guards makeMove illegal identity matrix.
 * Beyond wave39 restoreCapturedPiece / wave35 win settle. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { makeMove, getValidMoves } from '../../src/games/queens-guards/rules';
import {
  createInitialState,
  cellKey,
  type BoardCoord,
} from '../../src/games/queens-guards/types';

function firstOwnPiece(player: 'player1' | 'player2'): BoardCoord {
  const state = createInitialState();
  for (const [key, cell] of state.cells) {
    if (cell.piece?.player === player) {
      const [ring, position] = key.split('-').map(Number);
      return { ring, position };
    }
  }
  throw new Error('no piece');
}

describe('Wave 41 queens — makeMove identity rejects', () => {
  it('illegal destination returns same state reference', () => {
    const state = createInitialState();
    const from = firstOwnPiece('player1');
    const next = makeMove(state, from, { ring: 0, position: 0 });
    expect(next).toBe(state);
  });

  it('empty from-cell is identity', () => {
    const state = createInitialState();
    expect(
      makeMove(state, { ring: 0, position: 0 }, { ring: 1, position: 0 })
    ).toBe(state);
  });

  it('opponent piece from-cell is identity', () => {
    const state = createInitialState();
    const from = firstOwnPiece('player2');
    const valids = getValidMoves(state, from);
    expect(valids).toEqual([]);
    expect(makeMove(state, from, { ring: 2, position: 0 })).toBe(state);
  });

  it('legal move among opening valids mutates and flips seat', () => {
    const state = createInitialState();
    let moved = false;
    for (const [key, cell] of state.cells) {
      if (cell.piece?.player !== 'player1') continue;
      const [ring, position] = key.split('-').map(Number);
      const from = { ring, position };
      const valids = getValidMoves(state, from);
      if (valids.length === 0) continue;
      const next = makeMove(state, from, valids[0]);
      expect(next).not.toBe(state);
      expect(next.cells.get(cellKey(from.ring, from.position))?.piece).toBeNull();
      expect(
        next.cells.get(cellKey(valids[0].ring, valids[0].position))?.piece
      ).toBeTruthy();
      moved = true;
      break;
    }
    expect(moved).toBe(true);
  });
});
