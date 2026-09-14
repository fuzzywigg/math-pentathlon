/**
 * Overnight TOKENMAXX — Hex isCellEmpty leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { isCellEmpty, makeMove } from '../../src/games/hex/rules';

describe('Overnight hex — isCellEmpty', () => {
  it('true on open; false after place', () => {
    const s = createInitialState(3);
    expect(isCellEmpty(s.board, { row: 1, col: 1 })).toBe(true);
    const next = makeMove(s, { row: 1, col: 1 });
    expect(isCellEmpty(next.board, { row: 1, col: 1 })).toBe(false);
  });
});
