/**
 * Overnight TOKENMAXX — Hex winning path adjacency leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { makeMove, getWinningPath, getNeighbors } from '../../src/games/hex/rules';

describe('Overnight hex — winning path adjacent', () => {
  it('path cells are pairwise neighbors', () => {
    let s = createInitialState(3);
    s = makeMove(s, { row: 0, col: 1 });
    s = makeMove(s, { row: 0, col: 0 });
    s = makeMove(s, { row: 1, col: 1 });
    s = makeMove(s, { row: 0, col: 2 });
    s = makeMove(s, { row: 2, col: 1 });
    expect(s.winner).toBe('player1');
    const path = getWinningPath(s.board, 'player1', s.boardSize);
    expect(path.length).toBeGreaterThanOrEqual(3);
    for (let i = 0; i < path.length - 1; i++) {
      const nbs = getNeighbors(path[i], s.boardSize);
      expect(
        nbs.some((n) => n.row === path[i + 1].row && n.col === path[i + 1].col)
      ).toBe(true);
    }
  });
});
