/**
 * Wave 54 leftover after #237 — FIAR getValidMoves empty in placement leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fiar/types';
import { getValidMoves, canMove } from '../../src/games/fiar/rules';

describe('Wave 54 fiar — valid moves placement empty', () => {
  it('opening placement yields no movement valids; canMove false', () => {
    const state = createInitialState();
    expect(getValidMoves(state, '0-0')).toEqual([]);
    expect(canMove(state, '0-0', '0-1')).toBe(false);
  });
});
