/**
 * Overnight TOKENMAXX — Hex isValidMove winner gate leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { isValidMove } from '../../src/games/hex/rules';

describe('Overnight hex — winner gate', () => {
  it('empty cell invalid when winner already set', () => {
    const s = createInitialState(3);
    s.winner = 'player1';
    expect(isValidMove(s, { row: 1, col: 1 })).toBe(false);
  });
});
