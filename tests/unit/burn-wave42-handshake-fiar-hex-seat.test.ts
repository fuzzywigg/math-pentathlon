/**
 * Wave 42 — handshake: fiar × hex getOpponent seat agreement.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getOpponent as fiarOpp } from '../../src/games/fiar/types';
import { getOpponent as hexOpp } from '../../src/games/hex/types';
import { createInitialState as hexInit } from '../../src/games/hex/types';
import { makeMove } from '../../src/games/hex/rules';

describe('Wave 42 handshake — fiar × hex seat', () => {
  it('opponent helpers match', () => {
    expect(fiarOpp('player1')).toBe(hexOpp('player1'));
    expect(fiarOpp('player2')).toBe(hexOpp('player2'));
  });

  it('hex makeMove lands on fiarOpp(current)', () => {
    const state = hexInit(5);
    const next = makeMove(state, { row: 1, col: 1 });
    expect(next.currentPlayer).toBe(fiarOpp(state.currentPlayer));
    expect(next.currentPlayer).toBe(hexOpp('player1'));
  });
});
