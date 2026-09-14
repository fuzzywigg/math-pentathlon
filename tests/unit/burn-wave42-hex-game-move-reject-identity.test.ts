/**
 * Wave 42 — Hex game isValidMove reject leftovers.
 * Beyond wave41 reject matrix. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { isValidMove, makeMove } from '../../src/games/hex/rules';

describe('Wave 42 hex game — isValidMove rejects', () => {
  it('rejects OOB for every edge case on size 3', () => {
    const state = createInitialState(3);
    const oobs = [
      { row: -1, col: 1 },
      { row: 1, col: -1 },
      { row: 3, col: 0 },
      { row: 0, col: 3 },
      { row: 99, col: 99 },
    ];
    for (const pos of oobs) {
      expect(isValidMove(state, pos)).toBe(false);
      expect(makeMove(state, pos)).toBe(state);
    }
  });

  it('rejects occupied cell for both seats', () => {
    let state = createInitialState(5);
    state = makeMove(state, { row: 0, col: 0 });
    expect(state.currentPlayer).toBe('player2');
    expect(isValidMove(state, { row: 0, col: 0 })).toBe(false);
    expect(makeMove(state, { row: 0, col: 0 })).toBe(state);
  });

  it('rejects any cell once winner set', () => {
    const state = {
      ...createInitialState(5),
      winner: 'player2' as const,
    };
    expect(isValidMove(state, { row: 2, col: 2 })).toBe(false);
    expect(makeMove(state, { row: 2, col: 2 })).toBe(state);
  });
});
