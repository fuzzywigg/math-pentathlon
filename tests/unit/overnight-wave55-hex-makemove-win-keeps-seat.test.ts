/**
 * Wave 55 leftover after #250 — Hex winning makeMove keeps currentPlayer + moveNumber. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { makeMove } from '../../src/games/hex/rules';
import { getBestMove } from '../../src/games/hex/ai';

describe('Wave 55 hex — win keeps seat', () => {
  it('column win keeps P1 and AI is null after winner set', () => {
    let s = createInitialState(3);
    s = makeMove(s, { row: 0, col: 0 });
    s = makeMove(s, { row: 0, col: 1 });
    s = makeMove(s, { row: 1, col: 0 });
    s = makeMove(s, { row: 1, col: 1 });
    const won = makeMove(s, { row: 2, col: 0 });
    expect(won.winner).toBe('player1');
    expect(won.currentPlayer).toBe('player1');
    expect(won.moveHistory[0]?.moveNumber).toBe(1);
    expect(won.moveHistory[4]?.moveNumber).toBe(5);
    expect(getBestMove(won, 'player2')).toBeNull();
  });
});
