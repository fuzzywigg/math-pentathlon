/**
 * Overnight TOKENMAXX — Hex post-win identity leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import {
  makeMove,
  isValidMove,
  getValidMoves,
} from '../../src/games/hex/rules';

describe('Overnight hex — post-win identity', () => {
  it('further moves rejected after win', () => {
    let s = createInitialState(3);
    s = makeMove(s, { row: 0, col: 1 });
    s = makeMove(s, { row: 0, col: 0 });
    s = makeMove(s, { row: 1, col: 1 });
    s = makeMove(s, { row: 0, col: 2 });
    s = makeMove(s, { row: 2, col: 1 });
    expect(s.winner).toBe('player1');
    const next = makeMove(s, { row: 2, col: 2 });
    expect(next).toBe(s);
    expect(isValidMove(s, { row: 2, col: 2 })).toBe(false);
    expect(getValidMoves(s)).toEqual([]);
  });
});
