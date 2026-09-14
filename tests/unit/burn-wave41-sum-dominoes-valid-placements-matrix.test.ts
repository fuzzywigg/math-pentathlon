/**
 * Wave 41 — Sum Dominoes getValidPlacements / canPlay dense matrix. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  getValidPlacements,
  canPlayDomino,
  isValidPlacement,
} from '../../src/games/sum-dominoes/rules';
import { CONFIG, type Domino } from '../../src/games/sum-dominoes/types';

function makeDomino(id: string, face1: number, face2: number): Domino {
  return { id, face1, face2, owner: 'player1', orientation: 'horizontal' };
}

describe('Wave 41 sum-dominoes — valid placements matrix', () => {
  it('every returned placement passes isValidPlacement', () => {
    const state = createInitialState();
    const d = makeDomino('scan', 0, 3);
    const target = 6; // 0+6
    const placements = getValidPlacements(state, d, target);
    expect(placements.length).toBeGreaterThan(0);
    for (const p of placements) {
      expect(isValidPlacement(state, d, p.position, p.orientation, target)).toBe(
        true
      );
      expect(p.position.row).toBeGreaterThanOrEqual(0);
      expect(p.position.col).toBeGreaterThanOrEqual(0);
      expect(p.position.row).toBeLessThan(CONFIG.BOARD_SIZE);
      expect(p.position.col).toBeLessThan(CONFIG.BOARD_SIZE);
    }
    expect(canPlayDomino(state, d, target)).toBe(true);
  });

  it('canPlayDomino matches nonempty getValidPlacements', () => {
    const state = createInitialState();
    const faces: Array<[number, number]> = [
      [0, 0],
      [1, 1],
      [6, 0],
      [5, 5],
    ];
    for (const [a, b] of faces) {
      const d = makeDomino(`t-${a}-${b}`, a, b);
      for (const sum of [5, 6, 7, 12]) {
        expect(canPlayDomino(state, d, sum)).toBe(
          getValidPlacements(state, d, sum).length > 0
        );
      }
    }
  });

  it('first adjacency around center is the only seed for early plays', () => {
    const state = createInitialState();
    const center = state.board[CONFIG.CENTER_ROW][CONFIG.CENTER_COL];
    expect(center).not.toBeNull();
    const d = makeDomino('adj', 0, 0);
    const placements = getValidPlacements(state, d, 6);
    // All valid placements must be within manhattan range of the seed faces
    for (const p of placements) {
      const { row, col } = p.position;
      const near =
        Math.abs(row - CONFIG.CENTER_ROW) + Math.abs(col - CONFIG.CENTER_COL) <=
        3;
      expect(near).toBe(true);
    }
  });
});
