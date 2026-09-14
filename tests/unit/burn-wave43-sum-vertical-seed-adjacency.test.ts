/**
 * Wave 43 — Sum Dominoes vertical seed adjacency leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  canPlayDomino,
  getValidPlacements,
} from '../../src/games/sum-dominoes/rules';
import {
  CONFIG,
  type Domino,
  type PlacedDomino,
  type SumDominoesState,
} from '../../src/games/sum-dominoes/types';

function emptyBoard(): (PlacedDomino | null)[][] {
  return Array.from({ length: CONFIG.BOARD_SIZE }, () =>
    Array.from({ length: CONFIG.BOARD_SIZE }, () => null)
  );
}

function makeDomino(id: string, face1: number, face2: number): Domino {
  return { id, face1, face2, owner: 'player1', orientation: 'horizontal' };
}

describe('Wave 43 sum-dominoes — vertical seed adjacency', () => {
  it('finds placements against vertical double-six', () => {
    const board = emptyBoard();
    const seed = makeDomino('seed', 6, 6);
    const placed: PlacedDomino = {
      domino: { ...seed, owner: null, orientation: 'vertical' },
      position: { row: 5, col: 5 },
      orientation: 'vertical',
    };
    board[5][5] = placed;
    board[6][5] = placed;
    const play = makeDomino('play', 2, 4);
    const state: SumDominoesState = {
      board,
      hands: { player1: [play], player2: [] },
      currentPlayer: 'player1',
      currentDice: [3, 5],
      selectedDomino: null,
      phase: 'placing',
      winner: null,
      moveHistory: [],
      passCount: 0,
    };
    expect(canPlayDomino(state, play, 8)).toBe(true);
    expect(getValidPlacements(state, play, 8).length).toBeGreaterThan(0);
  });
});
