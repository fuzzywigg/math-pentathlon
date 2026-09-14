/**
 * Wave 42 — Queens & Guards makeMove seat flip and history leftovers after #186.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { makeMove, getValidMoves } from '../../src/games/queens-guards/rules';
import {
  createInitialState,
  cellKey,
  parseKey,
} from '../../src/games/queens-guards/types';

describe('Wave 42 queens — makeMove flip and history (non-capture)', () => {
  it('successful move empties source and fills destination', () => {
    const state = createInitialState();
    const from = { ring: 5, position: 1 };
    const to = { ring: 5, position: 0 };
    expect(getValidMoves(state, from).some((m) => m.ring === to.ring && m.position === to.position)).toBe(true);

    const next = makeMove(state, from, to);
    expect(next).not.toBe(state);
    expect(next.cells.get(cellKey(from.ring, from.position))?.piece).toBeNull();
    expect(next.cells.get(cellKey(to.ring, to.position))?.piece?.player).toBe(
      'player1'
    );
  });

  it('non-capture move flips currentPlayer to opponent', () => {
    const state = createInitialState();
    const from = { ring: 5, position: 1 };
    const to = { ring: 5, position: 0 };
    const next = makeMove(state, from, to);
    expect(next.capturedPieces).toHaveLength(0);
    expect(next.currentPlayer).toBe('player2');
  });

  it('records moveHistory entry with wasCapture false and incrementing moveNumber', () => {
    const state = createInitialState();
    const from = { ring: 5, position: 1 };
    const to = { ring: 5, position: 0 };
    const next = makeMove(state, from, to);
    expect(next.moveHistory).toHaveLength(1);
    const entry = next.moveHistory[0];
    expect(entry.player).toBe('player1');
    expect(entry.from).toEqual(from);
    expect(entry.to).toEqual(to);
    expect(entry.pieceType).toBe('guard');
    expect(entry.wasCapture).toBe(false);
    expect(entry.moveNumber).toBe(1);
    expect(next.selectedPiece).toBeNull();
  });

  it('finds any opening legal move and flips seat without capture', () => {
    const state = createInitialState();
    let tested = false;
    for (const [key, cell] of state.cells) {
      if (cell.piece?.player !== 'player1') continue;
      const from = parseKey(key);
      const valids = getValidMoves(state, from);
      if (valids.length === 0) continue;
      const next = makeMove(state, from, valids[0]);
      expect(next.currentPlayer).toBe('player2');
      expect(next.moveHistory.at(-1)?.wasCapture).toBe(false);
      tested = true;
      break;
    }
    expect(tested).toBe(true);
  });
});
