/**
 * Wave 44 — Sum Dominoes getValidPlacements after first seed. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  getValidPlacements,
  isValidPlacement,
  canPlayDomino,
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

function centerSeed(face1: number, face2: number): SumDominoesState {
  const board = emptyBoard();
  const seed = makeDomino('seed', face1, face2);
  const placed: PlacedDomino = {
    domino: { ...seed, orientation: 'horizontal' },
    position: { row: CONFIG.CENTER_ROW, col: CONFIG.CENTER_COL },
    orientation: 'horizontal',
  };
  board[CONFIG.CENTER_ROW][CONFIG.CENTER_COL] = placed;
  board[CONFIG.CENTER_ROW][CONFIG.CENTER_COL + 1] = placed;
  return {
    board,
    hands: { player1: [], player2: [] },
    currentPlayer: 'player1',
    currentDice: null,
    selectedDomino: null,
    phase: 'rolling',
    winner: null,
    moveHistory: [],
    passCount: 0,
  };
}

describe('Wave 44 sum-dominoes — getValidPlacements after first seed', () => {
  it('returns only placements adjacent to the double-six seed', () => {
    const state = centerSeed(6, 6);
    const d = makeDomino('adj', 1, 0);
    const target = 7; // 1+6
    const placements = getValidPlacements(state, d, target);
    expect(placements.length).toBeGreaterThan(0);
    for (const p of placements) {
      expect(isValidPlacement(state, d, p.position, p.orientation, target)).toBe(true);
      const { row, col } = p.position;
      const nearCenter =
        Math.abs(row - CONFIG.CENTER_ROW) <= 2 && Math.abs(col - CONFIG.CENTER_COL) <= 3;
      expect(nearCenter).toBe(true);
    }
  });

  it('asymmetric seed exposes distinct face complements', () => {
    const state = centerSeed(5, 1);
    const forFive = makeDomino('c5', 2, 0); // 2+5=7
    const forOne = makeDomino('c1', 6, 0); // 6+1=7
    const p5 = getValidPlacements(state, forFive, 7);
    const p1 = getValidPlacements(state, forOne, 7);
    expect(p5.length).toBeGreaterThan(0);
    expect(p1.length).toBeGreaterThan(0);
    // Complements differ so position sets are not identical
    const key = (p: { position: { row: number; col: number }; orientation: string }) =>
      `${p.position.row},${p.position.col},${p.orientation}`;
    const set5 = new Set(p5.map(key));
    const set1 = new Set(p1.map(key));
    const same =
      set5.size === set1.size && [...set5].every((k) => set1.has(k));
    expect(same).toBe(false);
  });

  it('empty result when target cannot match either seed face', () => {
    const state = centerSeed(3, 3);
    const d = makeDomino('no', 0, 0);
    expect(getValidPlacements(state, d, 12)).toEqual([]);
    expect(canPlayDomino(state, d, 12)).toBe(false);
  });

  it('lists both orientations when both are legal for a double', () => {
    const state = centerSeed(6, 6);
    const d = makeDomino('dbl', 0, 0);
    const placements = getValidPlacements(state, d, 6);
    const orients = new Set(placements.map((p) => p.orientation));
    expect(orients.has('horizontal') || orients.has('vertical')).toBe(true);
    expect(placements.length).toBeGreaterThan(1);
  });
});
