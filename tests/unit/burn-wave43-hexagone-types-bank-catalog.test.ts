/**
 * Wave 43 — Hex-a-Gone bank/color/size catalog leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  BLOCK_COLORS,
  BLOCK_SIZES,
  INITIAL_BANK,
  createInitialState,
  getOpponent,
  getAvailableShapes,
  getShapeCells,
  isValidPosition,
  getCellAt,
} from '../../src/games/hex-a-gone/types';

describe('Wave 43 hex-a-gone — types bank catalog', () => {
  it('BLOCK_COLORS / SIZES / INITIAL_BANK cover all five shapes', () => {
    const shapes = ['hexagon', 'trapezoid', 'rhombus', 'triangle', 'square'] as const;
    for (const shape of shapes) {
      expect(BLOCK_COLORS[shape]).toMatch(/^#/);
      expect(BLOCK_SIZES[shape]).toBeGreaterThan(0);
      expect(INITIAL_BANK[shape]).toBeGreaterThan(0);
    }
  });

  it('createInitialState builds radius-3 hex board and full bank', () => {
    const s = createInitialState();
    expect(s.board.length).toBe(37); // 3r hex = 1+6+12+18
    expect(s.phase).toBe('selectBlocks');
    expect(s.bank).toEqual(INITIAL_BANK);
    expect(s.turnSelection.blocks).toEqual([]);
    expect(s.winner).toBeNull();
    expect(getOpponent('player1')).toBe('player2');
  });

  it('getAvailableShapes lists all bank shapes at opening', () => {
    const s = createInitialState();
    expect(getAvailableShapes(s).sort()).toEqual(
      ['hexagon', 'rhombus', 'square', 'trapezoid', 'triangle'].sort()
    );
  });

  it('isValidPosition / getCellAt / getShapeCells for center and OOB', () => {
    const s = createInitialState();
    expect(isValidPosition(s, 0, 0)).toBe(true);
    expect(getCellAt(s, 0, 0)?.filled).toBe(false);
    expect(isValidPosition(s, 99, 99)).toBe(false);
    expect(getShapeCells('triangle', 1, -1, 0)).toEqual([{ q: 1, r: -1 }]);
  });
});
