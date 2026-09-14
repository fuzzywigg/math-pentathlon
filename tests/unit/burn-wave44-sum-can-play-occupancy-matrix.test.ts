/**
 * Wave 44 — Sum Dominoes canPlayDomino post-place occupancy matrix. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  canPlayDomino,
  placeDomino,
  getValidPlacements,
  isValidPlacement,
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

function withSeed(): SumDominoesState {
  const board = emptyBoard();
  const seed = makeDomino('seed', 6, 6);
  const placed: PlacedDomino = {
    domino: { ...seed, orientation: 'horizontal' },
    position: { row: 5, col: 5 },
    orientation: 'horizontal',
  };
  board[5][5] = placed;
  board[5][6] = placed;
  return {
    board,
    hands: {
      player1: [makeDomino('first', 0, 3), makeDomino('second', 3, 0)],
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
}

describe('Wave 44 sum-dominoes — canPlay occupancy after place', () => {
  it('occupied cells from place are no longer valid origins', () => {
    const state = withSeed();
    const first = state.hands.player1[0];
    const pick = getValidPlacements(state, first, 6)[0];
    const after = placeDomino(state, pick.position, pick.orientation);
    expect(
      isValidPlacement(after, makeDomino('x', 0, 0), pick.position, pick.orientation, 6)
    ).toBe(false);
  });

  it('second hand tile playability updates with new adjacency', () => {
    const state = withSeed();
    const first = state.hands.player1[0];
    const pick = getValidPlacements(state, first, 6)[0];
    const after = placeDomino(state, pick.position, pick.orientation);
    const second = makeDomino('second', 3, 0);
    // Against original seed alone, sum 9 needs 3+6 — playable; after place still check consistency
    expect(canPlayDomino(after, second, 9)).toBe(
      getValidPlacements(after, second, 9).length > 0
    );
    expect(canPlayDomino(after, second, 3)).toBe(
      getValidPlacements(after, second, 3).length > 0
    );
  });

  it('cannot play into fully isolated corner after place', () => {
    const state = withSeed();
    const first = state.hands.player1[0];
    const pick = getValidPlacements(state, first, 6)[0];
    const after = placeDomino(state, pick.position, pick.orientation);
    const corner = makeDomino('corner', 1, 1);
    // Far corner has no adjacency regardless of board growth near center
    expect(
      isValidPlacement(after, corner, { row: 0, col: 0 }, 'horizontal', 12)
    ).toBe(false);
    expect(canPlayDomino(after, corner, 99)).toBe(false);
  });
});
