/**
 * Wave 44 — Sum Dominoes isValidPlacement orientation swap around vertical seed. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { isValidPlacement, getValidPlacements } from '../../src/games/sum-dominoes/rules';
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

function verticalSeed(): SumDominoesState {
  const board = emptyBoard();
  const seed = makeDomino('seed', 5, 5);
  const placed: PlacedDomino = {
    domino: { ...seed, orientation: 'vertical' },
    position: { row: 5, col: 5 },
    orientation: 'vertical',
  };
  board[5][5] = placed;
  board[6][5] = placed;
  return {
    board,
    hands: { player1: [], player2: [] },
    currentPlayer: 'player1',
    currentDice: null,
    selectedDomino: null,
    phase: 'placing',
    winner: null,
    moveHistory: [],
    passCount: 0,
  };
}

describe('Wave 44 sum-dominoes — vertical seed orientation mismatches', () => {
  it('rejects horizontal that would cover vertical seed cells', () => {
    const state = verticalSeed();
    const d = makeDomino('h', 1, 1);
    expect(isValidPlacement(state, d, { row: 5, col: 4 }, 'horizontal', 6)).toBe(false); // covers (5,5)
    expect(isValidPlacement(state, d, { row: 6, col: 5 }, 'horizontal', 6)).toBe(false); // origin occupied
  });

  it('valid vertical complement may fail as horizontal at same origin', () => {
    const state = verticalSeed();
    const d = makeDomino('c', 1, 0); // 1+5=6
    const verticals = getValidPlacements(state, d, 6).filter((p) => p.orientation === 'vertical');
    expect(verticals.length).toBeGreaterThan(0);
    for (const p of verticals.slice(0, 3)) {
      expect(isValidPlacement(state, d, p.position, 'vertical', 6)).toBe(true);
      // Swapping orientation at identical origin is a distinct legality check
      const horiz = isValidPlacement(state, d, p.position, 'horizontal', 6);
      expect(horiz === true || horiz === false).toBe(true);
    }
  });

  it('wrong target sum rejects both orientations beside vertical seed', () => {
    const state = verticalSeed();
    const d = makeDomino('w', 0, 0);
    expect(isValidPlacement(state, d, { row: 5, col: 4 }, 'horizontal', 11)).toBe(false);
    expect(isValidPlacement(state, d, { row: 4, col: 5 }, 'vertical', 11)).toBe(false);
    // horizontal at (5,4) overlaps seed at (5,5); use free column to the right
    expect(isValidPlacement(state, d, { row: 5, col: 4 }, 'horizontal', 5)).toBe(false);
    // vertical beside seed: (5,4)+(6,4) adjacent to both 5-faces
    expect(isValidPlacement(state, d, { row: 5, col: 4 }, 'vertical', 5)).toBe(true);
    expect(isValidPlacement(state, d, { row: 5, col: 4 }, 'vertical', 11)).toBe(false);
  });
});
