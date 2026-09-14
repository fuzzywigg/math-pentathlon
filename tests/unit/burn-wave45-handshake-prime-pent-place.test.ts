/**
 * Wave 45 — Handshake Prime place / Pent place history leftovers. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  createInitialState as primeInit,
  rollDice,
  placeChip,
  getValidPlacements,
} from '../../src/games/prime-gold/rules';
import { createInitialState as pentInit } from '../../src/games/pent-em-in/types';
import { placePiece } from '../../src/games/pent-em-in/rules';

describe('Wave 45 handshake — place history', () => {
  afterEach(() => vi.restoreAllMocks());

  it('both engines record one move and flip seat', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    let prime = rollDice(primeInit());
    const pick = getValidPlacements(prime)[0];
    prime = placeChip(prime, pick.value, pick.expr);
    const pent = placePiece(pentInit(), 'X', { row: 3, col: 3 }, 0, false);
    expect(prime.moveHistory).toHaveLength(1);
    expect(pent.moveHistory).toHaveLength(1);
    expect(prime.currentPlayer).toBe('player2');
    expect(pent.currentPlayer).toBe('player2');
  });
});
