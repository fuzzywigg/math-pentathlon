/**
 * Wave 44 — Sum Dominoes no-adjacent-match leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { CONFIG, Domino, PlacedDomino } from '../../src/games/sum-dominoes/types';
import { isValidPlacement } from '../../src/games/sum-dominoes/rules';

function emptyBoard(): (PlacedDomino | null)[][] {
  return Array.from({ length: CONFIG.BOARD_SIZE }, () =>
    Array.from({ length: CONFIG.BOARD_SIZE }, () => null)
  );
}

describe('Wave 44 Sum Dominoes — valid placement no match', () => {
  it('isolated empty cell without adjacent match is false', () => {
    const board = emptyBoard();
    const seed: Domino = { id: 'seed', face1: 6, face2: 6, owner: null, orientation: 'horizontal' };
    const placed: PlacedDomino = { domino: seed, position: { row: 5, col: 5 }, orientation: 'horizontal' };
    board[5][5] = placed;
    board[5][6] = placed;
    const d: Domino = { id: 'd', face1: 0, face2: 0, owner: 'player1', orientation: 'horizontal' };
    const state = {
      board,
      hands: { player1: [d], player2: [] },
      currentPlayer: 'player1' as const,
      currentDice: [1, 1] as [number, number],
      selectedDomino: null,
      phase: 'placing' as const,
      winner: null,
      moveHistory: [],
      passCount: 0,
    };
    expect(isValidPlacement(state, d, { row: 0, col: 0 }, 'horizontal', 12)).toBe(false);
  });
});
