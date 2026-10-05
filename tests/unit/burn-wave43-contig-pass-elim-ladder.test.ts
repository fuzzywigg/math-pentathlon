/**
 * Wave 43 TOKENMAXX — Contig passTurn elim ladder leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { passTurn } from '../../src/games/contig-60/rules';
import { createInitialState } from '../../src/games/contig-60/types';

describe('Wave 43 contig — pass elim ladder', () => {
  it('wrong phase identity; mid passes flip; third solo pass does not eliminate', () => {
    const base = createInitialState();
    expect(passTurn(base)).toBe(base);

    const calc = {
      ...base,
      phase: 'calculating' as const,
      currentDice: [2, 3, 4] as [number, number, number],
      consecutivePasses: { player1: 0, player2: 0 },
    };
    const mid = passTurn(calc);
    expect(mid.phase).toBe('rolling');
    expect(mid.currentPlayer).toBe('player2');
    expect(mid.consecutivePasses.player1).toBe(1);

    const near = {
      ...calc,
      consecutivePasses: {
        player1: 2,
        player2: 0,
      },
    };
    const end = passTurn(near);
    expect(end.phase).toBe('rolling');
    expect(end.winner).toBeNull();
    expect(end.consecutivePasses.player1).toBe(3);
  });
});
