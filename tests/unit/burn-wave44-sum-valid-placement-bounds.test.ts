/**
 * Wave 44 — Sum Dominoes isValidPlacement bounds leftovers.
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

describe('Wave 44 Sum Dominoes — valid placement bounds', () => {
  it('rejects OOB and orientation overflow', () => {
    const board = emptyBoard();
    const d: Domino = { id: 'd', face1: 1, face2: 2, owner: 'player1', orientation: 'horizontal' };
    const state = {
      board,
      hands: { player1: [d], player2: [] },
      currentPlayer: 'player1' as const,
      currentDice: [3, 4] as [number, number],
      selectedDomino: null,
      phase: 'placing' as const,
      winner: null,
      moveHistory: [],
      passCount: 0,
    };
    expect(isValidPlacement(state, d, { row: -1, col: 0 }, 'horizontal', 7)).toBe(false);
    expect(isValidPlacement(state, d, { row: 0, col: 10 }, 'horizontal', 7)).toBe(false);
    expect(isValidPlacement(state, d, { row: 10, col: 0 }, 'vertical', 7)).toBe(false);
  });
});
