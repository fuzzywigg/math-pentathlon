/**
 * Wave 41 — Pent-Em-In getValidPlacements nonempty / empty when jammed.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, BOARD_SIZE } from '../../src/games/pent-em-in/types';
import {
  getValidPlacements,
  canPlacePiece,
} from '../../src/games/pent-em-in/rules';

describe('Wave 41 Pent-Em-In — getValidPlacements', () => {
  it('I5 has nonempty placements on empty board for rotation 0', () => {
    const state = createInitialState();
    const placements = getValidPlacements(state, 'I5', 0, false);
    expect(placements.length).toBeGreaterThan(0);
    for (const pos of placements.slice(0, 5)) {
      expect(canPlacePiece(state, 'I5', pos, 0, false)).toBe(true);
    }
  });

  it('rotated I5 also finds placements', () => {
    const state = createInitialState();
    const at90 = getValidPlacements(state, 'I5', 90, false);
    expect(at90.length).toBeGreaterThan(0);
  });

  it('fully occupied board yields empty placements', () => {
    const state = createInitialState();
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        state.board[r][c] = {
          row: r,
          col: c,
          occupied: true,
          owner: 'player2',
          pieceId: 'jam',
        };
      }
    }
    expect(getValidPlacements(state, 'X', 0, false)).toEqual([]);
    expect(getValidPlacements(state, 'I5', 0, false)).toEqual([]);
  });
});
