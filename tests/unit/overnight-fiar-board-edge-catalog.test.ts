/**
 * Overnight TOKENMAXX — FIAR board graph catalog leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createFiarBoard } from '../../src/games/fiar/types';

describe('Overnight fiar — board catalog', () => {
  it('5x5 nodes with H/V/diag edges and valid endpoints', () => {
    const board = createFiarBoard();
    expect(board.nodes.size).toBe(25);
    // 5*4 horiz + 5*4 vert + 4*4 diag-dr + 4*4 diag-dl = 20+20+16+16 = 72
    expect(board.edges).toHaveLength(72);
    for (const e of board.edges) {
      expect(board.nodes.has(e.from)).toBe(true);
      expect(board.nodes.has(e.to)).toBe(true);
    }
  });
});
