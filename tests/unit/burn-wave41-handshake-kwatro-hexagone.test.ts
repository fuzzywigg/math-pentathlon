/**
 * Wave 41 HEAVY — handshake: kwatro × hex-a-gone seat / phase openings.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState as kwaInit,
  hasValidMoves as kwaHasValidMoves,
} from '../../src/games/kwatro-sinko/rules';
import { getOpponent as kwaOpponent } from '../../src/games/kwatro-sinko/types';
import {
  createInitialState as hexInit,
  getOpponent as hexOpponent,
} from '../../src/games/hex-a-gone/types';
import { isGameOver as hexIsGameOver } from '../../src/games/hex-a-gone/rules';

describe('Wave 41 handshake — kwatro × hex-a-gone openings', () => {
  it('both player1; selecting phases; not gameOver', () => {
    const k = kwaInit();
    const h = hexInit();
    expect(k.currentPlayer).toBe('player1');
    expect(h.currentPlayer).toBe('player1');
    expect(k.phase).toBe('selectingChip');
    expect(h.phase).toBe('selectBlocks');
    expect(k.phase).not.toBe('gameOver');
    expect(hexIsGameOver(h)).toBe(false);
  });

  it('opponent helpers agree', () => {
    expect(kwaOpponent('player1')).toBe(hexOpponent('player1'));
    expect(kwaOpponent(kwaInit().currentPlayer)).toBe('player2');
  });

  it('kwatro opening has valid moves; hex bank non-empty', () => {
    const k = kwaInit();
    const h = hexInit();
    expect(kwaHasValidMoves(k)).toBe(true);
    const bankTotal = Object.values(h.bank).reduce((a, b) => a + b, 0);
    expect(bankTotal).toBeGreaterThan(0);
    expect(h.turnSelection.blocks).toEqual([]);
  });

  it('seat flip via opponent leaves counterpart opening intact', () => {
    const k = kwaInit();
    const h = hexInit();
    const nextSeat = kwaOpponent(k.currentPlayer);
    expect(nextSeat).toBe(hexOpponent(h.currentPlayer));
    expect(nextSeat).toBe('player2');
    // Fresh engines still open on player1
    expect(kwaInit().currentPlayer).toBe('player1');
    expect(hexInit().currentPlayer).toBe('player1');
  });
});
