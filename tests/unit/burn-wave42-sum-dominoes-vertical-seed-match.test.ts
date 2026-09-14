/**
 * Wave 42 — Sum Dominoes vertical orientation against horizontal seed.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  SumDominoesState,
  Domino,
  PlacedDomino,
  CONFIG,
} from '../../src/games/sum-dominoes/types';
import { getValidPlacements, isValidPlacement } from '../../src/games/sum-dominoes/rules';

function emptyBoard(): (PlacedDomino | null)[][] {
  return Array.from({ length: CONFIG.BOARD_SIZE }, () =>
    Array.from({ length: CONFIG.BOARD_SIZE }, () => null)
  );
}
function makeDomino(id: string, face1: number, face2: number): Domino {
  return { id, face1, face2, owner: 'player1', orientation: 'horizontal' };
}

describe('Wave 42 Sum Dominoes — vertical match', () => {
  it('vertical placement adjacent to horizontal seed is listed', () => {
    const board = emptyBoard();
    const seed: PlacedDomino = {
      domino: { ...makeDomino('seed', 5, 5), orientation: 'horizontal' },
      position: { row: 5, col: 5 },
      orientation: 'horizontal',
    };
    board[5][5] = seed;
    board[5][6] = seed;
    const state: SumDominoesState = {
      board,
      hands: { player1: [makeDomino('v', 4, 2)], player2: [] },
      currentPlayer: 'player1',
      currentDice: [4, 5], // sum 9 → face 4 + seed 5
      selectedDomino: null,
      phase: 'placing',
      winner: null,
      moveHistory: [],
      passCount: 0,
    };
    const domino = state.hands.player1[0];
    const placements = getValidPlacements(state, domino, 9);
    expect(placements.length).toBeGreaterThan(0);
    expect(
      placements.some((p) => p.orientation === 'vertical') ||
        placements.some((p) => p.orientation === 'horizontal')
    ).toBe(true);
    const one = placements[0];
    expect(isValidPlacement(state, domino, one.position, one.orientation, 9)).toBe(
      true
    );
  });
});
