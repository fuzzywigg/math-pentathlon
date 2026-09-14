/**
 * Wave 43 — Hex-a-Gone last place wins when opponent jammed. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createInitialState } from '../../src/games/hex-a-gone/types';
import {
  selectBlock,
  commitSelection,
  placeBlock,
  isGameOver,
} from '../../src/games/hex-a-gone/rules';

describe('Wave 43 hex-a-gone — fill board win', () => {
  it('filling last empty cell with turn complete awards winner', () => {
    let s = createInitialState();
    // fill all but one cell
    s = {
      ...s,
      board: s.board.map((c, i) =>
        i === 0 ? c : { ...c, filled: true, filledBy: 'player2' as const, blockId: i }
      ),
      bank: { hexagon: 0, trapezoid: 0, rhombus: 0, triangle: 1, square: 0 },
    };
    s = commitSelection(selectBlock(s, 'triangle'));
    const next = placeBlock(s, s.board[0].q, s.board[0].r);
    expect(isGameOver(next)).toBe(true);
    expect(next.winner).toBe('player1');
  });
});
