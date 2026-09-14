/**
 * Wave 44 — Sum Dominoes canPlayDomino false matrix after blocking place. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  canPlayDomino,
  placeDomino,
  getValidPlacements,
} from '../../src/games/sum-dominoes/rules';
import {
  CONFIG,
  type Domino,
  type PlacedDomino,
  type SumDominoesState,
} from '../../src/games/sum-dominoes/types';

function makeDomino(id: string, face1: number, face2: number): Domino {
  return { id, face1, face2, owner: 'player1', orientation: 'horizontal' };
}

function emptyBoard(): (PlacedDomino | null)[][] {
  return Array.from({ length: CONFIG.BOARD_SIZE }, () =>
    Array.from({ length: CONFIG.BOARD_SIZE }, () => null)
  );
}

describe('Wave 44 sum-dominoes — canPlay false matrix post-place', () => {
  it('sums that never match exposed faces stay false', () => {
    const board = emptyBoard();
    const seed = makeDomino('seed', 6, 6);
    const placed: PlacedDomino = {
      domino: { ...seed, orientation: 'horizontal' },
      position: { row: 5, col: 5 },
      orientation: 'horizontal',
    };
    board[5][5] = placed;
    board[5][6] = placed;
    const state: SumDominoesState = {
      board,
      hands: {
        player1: [makeDomino('first', 0, 0)],
        player2: [],
      },
      currentPlayer: 'player1',
      currentDice: [3, 3],
      selectedDomino: 'first',
      phase: 'placing',
      winner: null,
      moveHistory: [],
      passCount: 0,
    };
    const pick = getValidPlacements(state, state.hands.player1[0], 6)[0];
    const after = placeDomino(state, pick.position, pick.orientation);
    const probe = makeDomino('p', 2, 2);
    // Exposed faces are 6 and 0 — 2+face needs face in {6,0} → sums 8 or 2
    expect(canPlayDomino(after, probe, 8)).toBe(true);
    expect(canPlayDomino(after, probe, 2)).toBe(true);
    expect(canPlayDomino(after, probe, 3)).toBe(false);
    expect(canPlayDomino(after, probe, 4)).toBe(false);
    expect(canPlayDomino(after, probe, 5)).toBe(false);
    expect(canPlayDomino(after, probe, 7)).toBe(false);
    expect(canPlayDomino(after, probe, 9)).toBe(false);
    expect(canPlayDomino(after, probe, 10)).toBe(false);
    expect(canPlayDomino(after, probe, 11)).toBe(false);
    expect(canPlayDomino(after, probe, 12)).toBe(false);
  });

  it('empty board after wiping seed yields universal false', () => {
    const state: SumDominoesState = {
      board: emptyBoard(),
      hands: { player1: [], player2: [] },
      currentPlayer: 'player1',
      currentDice: null,
      selectedDomino: null,
      phase: 'rolling',
      winner: null,
      moveHistory: [],
      passCount: 0,
    };
    const d = makeDomino('any', 3, 4);
    for (const sum of [2, 5, 7, 10, 12]) {
      expect(canPlayDomino(state, d, sum)).toBe(false);
      expect(getValidPlacements(state, d, sum)).toEqual([]);
    }
  });
});
