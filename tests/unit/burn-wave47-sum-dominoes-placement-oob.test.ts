/**
 * Wave 47 leftover after #214/#215 — Sum Dominoes isValidPlacement OOB leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  isValidPlacement,
  getValidPlacements,
} from '../../src/games/sum-dominoes/rules';
import { CONFIG, type Domino, type PlacedDomino, type SumDominoesState } from '../../src/games/sum-dominoes/types';

function makeDomino(id: string, face1: number, face2: number): Domino {
  return { id, face1, face2, owner: 'player1', orientation: 'horizontal' };
}

function emptyBoard(): (PlacedDomino | null)[][] {
  return Array.from({ length: CONFIG.BOARD_SIZE }, () =>
    Array.from({ length: CONFIG.BOARD_SIZE }, () => null)
  );
}

describe('Wave 47 sum deepen 7 — sum-dominoes — placement OOB', () => {
  it('rejects negative and beyond-board row/col', () => {
    const state = createInitialState();
    const d = makeDomino('oob', 3, 3);
    expect(isValidPlacement(state, d, { row: -1, col: 5 }, 'horizontal', 9)).toBe(false);
    expect(isValidPlacement(state, d, { row: 5, col: -1 }, 'vertical', 9)).toBe(false);
    expect(
      isValidPlacement(state, d, { row: CONFIG.BOARD_SIZE, col: 0 }, 'horizontal', 9)
    ).toBe(false);
    expect(
      isValidPlacement(state, d, { row: 0, col: CONFIG.BOARD_SIZE }, 'vertical', 9)
    ).toBe(false);
  });

  it('rejects horizontal when col+1 overflows', () => {
    const state = createInitialState();
    const d = makeDomino('edge-h', 1, 2);
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

  it('rejects vertical when row+1 overflows', () => {
    const state = createInitialState();
    const d = makeDomino('edge-v', 1, 2);
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

  it('getValidPlacements stays empty on empty board (no adjacency)', () => {
    const board = emptyBoard();
    const state: SumDominoesState = {
      ...createInitialState(),
      board,
    };
    const d = makeDomino('lonely', 6, 6);
    expect(getValidPlacements(state, d, 12)).toEqual([]);
  });
});
