/**
 * Overnight HEAVY leftover after #256 — canPlaceShape only via flip on crafted board.
 * Distinct from wave53 canRotate:false I. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createBoardWithBlockedCells,
  canPlaceShape,
  type PolyominoShape,
} from '../../src/core/polyomino';

describe('Wave 56 core poly — canPlace needs flip', () => {
  it('asymmetric no-rotate shape fits only when canFlip true', () => {
    const base: PolyominoShape = {
      id: 'skew-w56',
      name: 'skew',
      cells: [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 1, col: 1 },
      ],
      color: '#000',
      canRotate: false,
      canFlip: true,
      size: 3,
      order: 3,
    };
    // 2×2 with bottom-right blocked: unflipped needs (1,1); flip needs (1,0)
    const board = createBoardWithBlockedCells(2, 2, [{ row: 1, col: 1 }]);
    expect(canPlaceShape(board, base)).toBe(true);
    expect(canPlaceShape(board, { ...base, canFlip: false })).toBe(false);
  });
});
