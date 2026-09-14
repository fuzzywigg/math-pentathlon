/**
 * Overnight HEAVY after #214/#215 — Ramrod pass when no moves leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, passTurn, hasValidMoves } from '../../src/games/ramrod/rules';

describe('Overnight ramrod — pass/no-moves', () => {
  it('empty hand hasValidMoves false; pass flips or settles', () => {
    const s = createInitialState();
    const empty = {
      ...s,
      playerRods: { ...s.playerRods, player1: [] as string[] },
    };
    expect(hasValidMoves(empty)).toBe(false);
    const next = passTurn(empty);
    expect(next.currentPlayer === 'player2' || next.phase === 'gameOver').toBe(true);
  });
});
