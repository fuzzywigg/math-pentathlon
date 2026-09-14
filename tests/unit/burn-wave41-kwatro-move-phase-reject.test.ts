/**
 * Wave 41 — Kwatro-Sinko isValidMove / moveChip phase rejects. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  selectChip,
  moveChip,
  isValidMove,
  getValidMoves,
} from '../../src/games/kwatro-sinko/rules';
import type { KwaState } from '../../src/games/kwatro-sinko/types';

describe('Wave 41 kwatro-sinko — move phase reject', () => {
  it('moveChip identity without selectingDest', () => {
    const state = createInitialState();
    expect(moveChip(state, 'n1-0')).toBe(state);
    const over: KwaState = { ...state, phase: 'gameOver', winner: 'player2' };
    expect(moveChip(over, 'n1-0')).toBe(over);
  });

  it('moveChip identity for occupied / non-connected dest', () => {
    const selected = selectChip(createInitialState(), 'p1-0');
    expect(selected.phase).toBe('selectingDest');
    // Occupied by sibling on top row
    expect(moveChip(selected, 'n0-1')).toBe(selected);
    expect(isValidMove(selected, 'p1-0', 'n0-1')).toBe(false);
    // Far node typically not connected from corner
    expect(moveChip(selected, 'n4-4')).toBe(selected);
  });

  it('isValidMove mirrors getValidMoves membership', () => {
    const state = createInitialState();
    const moves = getValidMoves(state, 'p1-2');
    expect(moves.length).toBeGreaterThan(0);
    for (const dest of moves) {
      expect(isValidMove(state, 'p1-2', dest)).toBe(true);
    }
    expect(isValidMove(state, 'p1-2', 'not-a-node')).toBe(false);
  });

  it('successful move clears selection and advances seat unless gameOver', () => {
    const state = createInitialState();
    const moves = getValidMoves(state, 'p1-0');
    expect(moves.length).toBeGreaterThan(0);
    let next = selectChip(state, 'p1-0');
    next = moveChip(next, moves[0]);
    expect(next).not.toBe(state);
    expect(next.selectedChip).toBeNull();
    expect(next.moveHistory).toHaveLength(1);
    if (next.phase === 'gameOver') {
      expect(next.winner).toBe('player1');
    } else {
      expect(next.currentPlayer).toBe('player2');
      expect(next.phase).toBe('selectingChip');
    }
  });
});
