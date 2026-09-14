/**
 * Overnight TOKENMAXX — Hex winning makeMove keeps seat leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { makeMove } from '../../src/games/hex/rules';

describe('Overnight hex — win keeps seat', () => {
  it('column win leaves currentPlayer as winner', () => {
    let s = createInitialState(3);
    // p1 top-bottom: col 1 rows 0,1,2 — alternate with p2 elsewhere
    s = makeMove(s, { row: 0, col: 1 }); // p1
    s = makeMove(s, { row: 0, col: 0 }); // p2
    s = makeMove(s, { row: 1, col: 1 }); // p1
    s = makeMove(s, { row: 0, col: 2 }); // p2
    s = makeMove(s, { row: 2, col: 1 }); // p1 wins
    expect(s.winner).toBe('player1');
    expect(s.currentPlayer).toBe('player1');
    expect(s.moveHistory.length).toBe(5);
  });
});
