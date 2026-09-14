/**
 * Wave 45 — Kwatro getValidMoves occupied/reject leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, getValidMoves, isValidMove } from '../../src/games/kwatro-sinko/rules';

describe('Wave 45 kwatro — valid moves', () => {
  it('opening p1-0 can move down; not onto occupied sibling', () => {
    const state = createInitialState();
    const moves = getValidMoves(state, 'p1-0');
    expect(moves).toContain('n1-0');
    expect(moves).not.toContain('n0-1'); // occupied by p1-1
    expect(isValidMove(state, 'p1-0', 'n1-0')).toBe(true);
    expect(isValidMove(state, 'p1-0', 'n0-1')).toBe(false);
  });

  it('unknown chip yields empty', () => {
    expect(getValidMoves(createInitialState(), 'ghost')).toEqual([]);
  });
});
