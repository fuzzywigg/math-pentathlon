/**
 * Wave 48 — CJR getOpponent parity leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getOpponent as cOpp } from '../../src/games/calla/types';
import { getOpponent as jOpp } from '../../src/games/juggle/types';
import { getOpponent as rOpp } from '../../src/games/ramrod/types';

describe('Wave 48 handshake — CJR opponents', () => {
  it('opponent flips match across engines', () => {
    expect(cOpp('player1')).toBe('player2');
    expect(jOpp('player1')).toBe(rOpp('player1'));
    expect(cOpp('player2')).toBe(jOpp('player2'));
  });
});
