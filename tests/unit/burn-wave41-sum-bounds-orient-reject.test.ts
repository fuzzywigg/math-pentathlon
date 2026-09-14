/**
 * Wave 41 — Sum Dominoes bounds/orientation reject + empty-board placements leftovers. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  Domino,
  PlacedDomino,
  CONFIG,
} from '../../src/games/sum-dominoes/types';
import {
  createInitialState,
  canPlayDomino,
  isValidPlacement,
  getValidPlacements,
} from '../../src/games/sum-dominoes/rules';

function emptyBoard(): (PlacedDomino | null)[][] {
  return Array.from({ length: CONFIG.BOARD_SIZE }, () =>
    Array.from({ length: CONFIG.BOARD_SIZE }, () => null)
  );
}

function makeDomino(id: string, face1: number, face2: number): Domino {
  return { id, face1, face2, owner: 'player1', orientation: 'horizontal' };
}

describe('Wave 41 Sum Dominoes — bounds + orientation reject', () => {
  it('rejects negative and oversized row/col', () => {
    const state = createInitialState();
    const d = makeDomino('x', 2, 3);
    expect(
      isValidPlacement(state, d, { row: -1, col: 5 }, 'horizontal', 8)
    ).toBe(false);
    expect(
      isValidPlacement(state, d, { row: 5, col: -1 }, 'vertical', 8)
    ).toBe(false);
    expect(
      isValidPlacement(
        state,
        d,
        { row: CONFIG.BOARD_SIZE, col: 0 },
        'horizontal',
        8
      )
    ).toBe(false);
  });

  it('rejects horizontal when col+1 exceeds board', () => {
    const state = createInitialState();
    const d = makeDomino('edge', 1, 1);
    expect(
      isValidPlacement(
        state,
        d,
        { row: 0, col: CONFIG.BOARD_SIZE - 1 },
        'horizontal',
        7
      )
    ).toBe(false);
  });

  it('rejects vertical when row+1 exceeds board', () => {
    const state = createInitialState();
    const d = makeDomino('edge', 1, 1);
    expect(
      isValidPlacement(
        state,
        d,
        { row: CONFIG.BOARD_SIZE - 1, col: 0 },
        'vertical',
        7
      )
    ).toBe(false);
  });

  it('rejects occupied cells under either orientation', () => {
    const state = createInitialState();
    const d = makeDomino('clash', 2, 2);
    // Center already occupied by seed
    expect(
      isValidPlacement(
        state,
        d,
        { row: CONFIG.CENTER_ROW, col: CONFIG.CENTER_COL },
        'horizontal',
        8
      )
    ).toBe(false);
    expect(
      isValidPlacement(
        state,
        d,
        { row: CONFIG.CENTER_ROW, col: CONFIG.CENTER_COL },
        'vertical',
        8
      )
    ).toBe(false);
  });

  it('wrong orientation against a valid adjacency sum still fails if cells clash', () => {
    const state = createInitialState();
    const d = makeDomino('m', 2, 3);
    // Horizontal at (5,4) would need (5,5) which is occupied
    expect(
      isValidPlacement(state, d, { row: 5, col: 4 }, 'horizontal', 8)
    ).toBe(false);
  });
});

describe('Wave 41 Sum Dominoes — empty board getValidPlacements', () => {
  it('returns empty when board has no adjacent faces', () => {
    const state = {
      ...createInitialState(),
      board: emptyBoard(),
    };
    const d = makeDomino('lonely', 3, 4);
    expect(getValidPlacements(state, d, 7)).toEqual([]);
    expect(canPlayDomino(state, d, 7)).toBe(false);
    expect(canPlayDomino(state, d, 12)).toBe(false);
  });

  it('opening seed board yields some placements for complement faces', () => {
    const state = createInitialState();
    const seed = state.board[CONFIG.CENTER_ROW][CONFIG.CENTER_COL]!;
    const face = seed.domino.face1;
    // Need myFace + face = targetSum → myFace = targetSum - face
    const myFace = 2;
    const targetSum = myFace + face;
    const d = makeDomino('complement', myFace, 0);
    const placements = getValidPlacements(state, d, targetSum);
    expect(placements.length).toBeGreaterThan(0);
    expect(canPlayDomino(state, d, targetSum)).toBe(true);
    for (const p of placements) {
      expect(
        isValidPlacement(state, d, p.position, p.orientation, targetSum)
      ).toBe(true);
    }
  });
});
