/**
 * Wave 44 — Contig passTurn mid-threshold leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { passTurn } from '../../src/games/contig-60/rules';

describe('Wave 44 Contig — pass mid threshold', () => {
  it('increments passes and flips seat without elim', () => {
    const s = {
      ...createInitialState(),
      phase: 'calculating' as const,
      currentDice: [1, 2, 3] as [number, number, number],
      consecutivePasses: { player1: 0, player2: 0 },
    };
    const next = passTurn(s);
    expect(next.phase).toBe('rolling');
    expect(next.currentPlayer).toBe('player2');
    expect(next.consecutivePasses.player1).toBe(1);
    expect(next.winner).toBeNull();
  });

  it('clears dice after pass', () => {
    const s = {
      ...createInitialState(),
      phase: 'calculating' as const,
      currentDice: [6, 6, 6] as [number, number, number],
    };
    expect(passTurn(s).currentDice).toBeNull();
  });
});
