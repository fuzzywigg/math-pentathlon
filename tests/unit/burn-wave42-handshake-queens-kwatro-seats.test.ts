/**
 * Wave 42 — Queens seat flip × Kwatro opponent helpers handshake after #186.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { getOpponent as kwaOpp } from '../../src/games/kwatro-sinko/types';
import {
  createInitialState as createKwatro,
  selectChip,
  moveChip,
  getValidMoves,
} from '../../src/games/kwatro-sinko/rules';
import {
  getOpponent as qgOpp,
  createInitialState as createQueens,
  cellKey,
} from '../../src/games/queens-guards/types';
import {
  selectPiece,
  makeMove,
  getValidMoves as qgMoves,
} from '../../src/games/queens-guards/rules';

describe('Wave 42 handshake — queens × kwatro seats', () => {
  it('opponent helpers agree on flip semantics', () => {
    expect(kwaOpp('player1')).toBe('player2');
    expect(kwaOpp('player2')).toBe('player1');
    expect(qgOpp('player1')).toBe('player2');
    expect(qgOpp('player2')).toBe('player1');
  });

  it('one legal kwatro move flips seat when not gameOver', () => {
    const state = createKwatro();
    const chipId = 'p1-0';
    const dests = getValidMoves(state, chipId);
    expect(dests.length).toBeGreaterThan(0);
    let next = selectChip(state, chipId);
    next = moveChip(next, dests[0]);
    if (next.phase !== 'gameOver') {
      expect(next.currentPlayer).toBe('player2');
    }
  });

  it('one legal queens move flips seat when no capture', () => {
    const state = createQueens();
    let moved = false;
    for (const [, cell] of state.cells) {
      if (cell.piece?.player !== 'player1') continue;
      const from = { ring: cell.ring, position: cell.position };
      const moves = qgMoves(state, from);
      if (moves.length === 0) continue;
      const selected = selectPiece(state, from);
      expect(selected.selectedPiece).toBe(cellKey(from.ring, from.position));
      const next = makeMove(selected, from, moves[0]);
      expect(next).not.toBe(selected);
      expect(next.cells.get(cellKey(from.ring, from.position))?.piece).toBeNull();
      if (!next.moveHistory.at(-1)?.wasCapture && !next.winner) {
        expect(next.currentPlayer).toBe('player2');
      }
      moved = true;
      break;
    }
    expect(moved).toBe(true);
  });

  it('fresh createInitialState maps are independent', () => {
    const a = createKwatro();
    const b = createKwatro();
    expect(a.nodes).not.toBe(b.nodes);
    const q1 = createQueens();
    const q2 = createQueens();
    expect(q1.cells).not.toBe(q2.cells);
  });
});
