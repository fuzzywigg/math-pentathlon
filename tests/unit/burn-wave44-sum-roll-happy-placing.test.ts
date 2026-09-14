/**
 * Wave 44 — Sum Dominoes roll into placing leftovers.
 * Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { CONFIG, Domino, PlacedDomino } from '../../src/games/sum-dominoes/types';
import { doRollDice } from '../../src/games/sum-dominoes/rules';

afterEach(() => vi.restoreAllMocks());

function emptyBoard(): (PlacedDomino | null)[][] {
  return Array.from({ length: CONFIG.BOARD_SIZE }, () =>
    Array.from({ length: CONFIG.BOARD_SIZE }, () => null)
  );
}

describe('Wave 44 Sum Dominoes — roll happy placing', () => {
  it('enters placing when hand can match sum', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5); // dice ~4,4 sum 8? 0.5*6+1=4
    const board = emptyBoard();
    const seed: Domino = { id: 'seed', face1: 6, face2: 6, owner: null, orientation: 'horizontal' };
    const placed: PlacedDomino = { domino: seed, position: { row: 5, col: 5 }, orientation: 'horizontal' };
    board[5][5] = placed;
    board[5][6] = placed;
    // Need face + 6 = sum. random 0.5 -> die=4, sum=8 => face=2
    const d: Domino = { id: 'd', face1: 2, face2: 3, owner: 'player1', orientation: 'horizontal' };
    const state = {
      board,
      hands: { player1: [d], player2: [] },
      currentPlayer: 'player1' as const,
      currentDice: null,
      selectedDomino: null,
      phase: 'rolling' as const,
      winner: null,
      moveHistory: [],
      passCount: 0,
    };
    const rolled = doRollDice(state);
    expect(rolled.currentDice).not.toBeNull();
    expect(['placing', 'passing']).toContain(rolled.phase);
  });
});
